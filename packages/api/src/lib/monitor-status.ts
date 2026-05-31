import { db, timeseries } from "@uptimekit/db";
import {
	maintenance,
	maintenanceMonitor,
} from "@uptimekit/db/schema/maintenance";
import { worker } from "@uptimekit/db/schema/workers";
import { and, eq, inArray } from "drizzle-orm";

export type MonitorRuntimeStatus =
	| "up"
	| "down"
	| "degraded"
	| "maintenance"
	| "pending";

export interface WorkerStatusSnapshot {
	status: MonitorRuntimeStatus;
	timestamp: Date;
}

export interface ConfiguredWorkerStateResult {
	allWorkersReporting: boolean;
	states: WorkerStatusSnapshot[];
}

export interface AggregateMonitorStatusResult
	extends ConfiguredWorkerStateResult {
	status: MonitorRuntimeStatus;
	allWorkersDownSince: Date | null;
}

export interface EffectiveMonitorWorker {
	id: string;
	name: string;
	location: string;
}

export interface MonitorWorkerAssignment {
	id: string;
	workerIds?: string[] | null;
	locations?: string[] | null;
}

export interface AutomaticIncidentOpenEvaluation {
	eligible: boolean;
	allWorkersDownSince: Date | null;
}

function unique(values: string[]) {
	return [...new Set(values.filter(Boolean))];
}

export function normalizeMonitorStatus(status: string): MonitorRuntimeStatus {
	switch (status.toLowerCase()) {
		case "up":
		case "down":
		case "degraded":
		case "maintenance":
		case "pending":
			return status.toLowerCase() as MonitorRuntimeStatus;
		default:
			return "pending";
	}
}

export function getConfiguredWorkerStates(
	configuredWorkerIds: string[],
	workerStatusById: Map<string, WorkerStatusSnapshot>,
): ConfiguredWorkerStateResult {
	if (configuredWorkerIds.length === 0) {
		return {
			allWorkersReporting: false,
			states: [],
		};
	}

	const states = configuredWorkerIds
		.map((workerId) => workerStatusById.get(workerId))
		.filter((state): state is WorkerStatusSnapshot => !!state);

	return {
		allWorkersReporting: states.length === configuredWorkerIds.length,
		states,
	};
}

export function getAggregateMonitorStatus(input: {
	configuredWorkerIds: string[];
	workerStatusById: Map<string, WorkerStatusSnapshot>;
	isUnderMaintenance?: boolean;
}): AggregateMonitorStatusResult {
	if (input.isUnderMaintenance) {
		return {
			status: "maintenance",
			allWorkersReporting: true,
			states: [],
			allWorkersDownSince: null,
		};
	}

	const configuredWorkerStates = getConfiguredWorkerStates(
		input.configuredWorkerIds,
		input.workerStatusById,
	);

	if (
		input.configuredWorkerIds.length === 0 ||
		!configuredWorkerStates.allWorkersReporting
	) {
		return {
			...configuredWorkerStates,
			status: "pending",
			allWorkersDownSince: null,
		};
	}

	const allWorkersDown = configuredWorkerStates.states.every(
		(state) => state.status === "down",
	);

	if (allWorkersDown) {
		return {
			...configuredWorkerStates,
			status: "down",
			allWorkersDownSince: new Date(
				Math.max(
					...configuredWorkerStates.states.map((state) =>
						state.timestamp.getTime(),
					),
				),
			),
		};
	}

	if (
		configuredWorkerStates.states.some(
			(state) => state.status === "maintenance",
		)
	) {
		return {
			...configuredWorkerStates,
			status: "maintenance",
			allWorkersDownSince: null,
		};
	}

	if (configuredWorkerStates.states.some((state) => state.status === "down")) {
		return {
			...configuredWorkerStates,
			status: "degraded",
			allWorkersDownSince: null,
		};
	}

	if (configuredWorkerStates.states.every((state) => state.status === "up")) {
		return {
			...configuredWorkerStates,
			status: "up",
			allWorkersDownSince: null,
		};
	}

	return {
		...configuredWorkerStates,
		status: "degraded",
		allWorkersDownSince: null,
	};
}

export function isAutomaticIncidentOpenEligible(input: {
	configuredWorkerIds: string[];
	workerStatusById: Map<string, WorkerStatusSnapshot>;
	activeIncident: { id: string } | undefined;
	eventTime: Date;
	incidentPendingDurationSeconds: number;
	isUnderMaintenance?: boolean;
}): AutomaticIncidentOpenEvaluation {
	if (input.activeIncident) {
		return { eligible: false, allWorkersDownSince: null };
	}

	const aggregateStatus = getAggregateMonitorStatus({
		configuredWorkerIds: input.configuredWorkerIds,
		workerStatusById: input.workerStatusById,
		isUnderMaintenance: input.isUnderMaintenance,
	});

	if (
		aggregateStatus.status !== "down" ||
		!aggregateStatus.allWorkersDownSince
	) {
		return {
			eligible: false,
			allWorkersDownSince: aggregateStatus.allWorkersDownSince,
		};
	}

	const durationMs =
		input.eventTime.getTime() - aggregateStatus.allWorkersDownSince.getTime();
	const pendingMs = input.incidentPendingDurationSeconds * 1000;

	return {
		eligible: durationMs >= pendingMs,
		allWorkersDownSince: aggregateStatus.allWorkersDownSince,
	};
}

export function isAutomaticIncidentResolveEligible(input: {
	configuredWorkerIds: string[];
	workerStatusById: Map<string, WorkerStatusSnapshot>;
	activeIncident: { id: string } | undefined;
}): boolean {
	if (!input.activeIncident) {
		return false;
	}

	const configuredWorkerStates = getConfiguredWorkerStates(
		input.configuredWorkerIds,
		input.workerStatusById,
	);

	return configuredWorkerStates.states.some((state) => state.status !== "down");
}

async function getActiveMaintenanceMonitorIds(monitorIds: string[]) {
	if (monitorIds.length === 0) {
		return new Set<string>();
	}

	const rows = await db
		.select({ monitorId: maintenanceMonitor.monitorId })
		.from(maintenanceMonitor)
		.innerJoin(
			maintenance,
			eq(maintenanceMonitor.maintenanceId, maintenance.id),
		)
		.where(
			and(
				inArray(maintenanceMonitor.monitorId, monitorIds),
				eq(maintenance.status, "in_progress"),
			),
		);

	return new Set(rows.map((row) => row.monitorId));
}

export async function getEffectiveWorkersForMonitors(
	monitors: MonitorWorkerAssignment[],
	options: { activeOnly?: boolean } = {},
) {
	const activeOnly = options.activeOnly ?? true;
	const explicitWorkerIds = unique(
		monitors.flatMap((monitorRecord) => monitorRecord.workerIds ?? []),
	);
	const fallbackLocations = unique(
		monitors.flatMap((monitorRecord) =>
			(monitorRecord.workerIds ?? []).length > 0
				? []
				: (monitorRecord.locations ?? []),
		),
	);

	const [explicitWorkers, fallbackWorkers] = await Promise.all([
		explicitWorkerIds.length > 0
			? db
					.select({
						id: worker.id,
						name: worker.name,
						location: worker.location,
					})
					.from(worker)
					.where(
						activeOnly
							? and(
									inArray(worker.id, explicitWorkerIds),
									eq(worker.active, true),
								)
							: inArray(worker.id, explicitWorkerIds),
					)
			: Promise.resolve([]),
		fallbackLocations.length > 0
			? db
					.select({
						id: worker.id,
						name: worker.name,
						location: worker.location,
					})
					.from(worker)
					.where(
						activeOnly
							? and(
									inArray(worker.location, fallbackLocations),
									eq(worker.active, true),
								)
							: inArray(worker.location, fallbackLocations),
					)
			: Promise.resolve([]),
	]);

	const explicitWorkersById = new Map(
		explicitWorkers.map((workerRecord) => [workerRecord.id, workerRecord]),
	);
	const fallbackWorkersByLocation = new Map<string, EffectiveMonitorWorker[]>();

	for (const workerRecord of fallbackWorkers) {
		const workersForLocation =
			fallbackWorkersByLocation.get(workerRecord.location) ?? [];
		workersForLocation.push(workerRecord);
		fallbackWorkersByLocation.set(workerRecord.location, workersForLocation);
	}

	const workersByMonitorId = new Map<string, EffectiveMonitorWorker[]>();

	for (const monitorRecord of monitors) {
		const monitorWorkerIds = unique(monitorRecord.workerIds ?? []);
		const monitorLocations = unique(monitorRecord.locations ?? []);

		if (monitorWorkerIds.length > 0) {
			workersByMonitorId.set(
				monitorRecord.id,
				monitorWorkerIds
					.map((workerId) => explicitWorkersById.get(workerId))
					.filter(
						(workerRecord): workerRecord is EffectiveMonitorWorker =>
							workerRecord !== undefined,
					),
			);
			continue;
		}

		workersByMonitorId.set(
			monitorRecord.id,
			monitorLocations.flatMap(
				(location) => fallbackWorkersByLocation.get(location) ?? [],
			),
		);
	}

	return workersByMonitorId;
}

export async function getEffectiveMonitorWorkers(
	monitorRecord: MonitorWorkerAssignment,
	options: { activeOnly?: boolean } = {},
) {
	const workersByMonitor = await getEffectiveWorkersForMonitors(
		[monitorRecord],
		options,
	);
	return workersByMonitor.get(monitorRecord.id) ?? [];
}

export async function getAggregateMonitorStatusesForMonitors(
	monitors: MonitorWorkerAssignment[],
	options: {
		activeMaintenanceMonitorIds?: Set<string>;
		activeOnlyWorkers?: boolean;
	} = {},
) {
	const monitorIds = monitors.map((monitorRecord) => monitorRecord.id);
	const [
		workersByMonitorId,
		latestWorkerStatuses,
		activeMaintenanceMonitorIds,
	] = await Promise.all([
		getEffectiveWorkersForMonitors(monitors, {
			activeOnly: options.activeOnlyWorkers ?? true,
		}),
		timeseries.getLatestStatusPerLocationForMonitors(monitorIds),
		options.activeMaintenanceMonitorIds ??
			getActiveMaintenanceMonitorIds(monitorIds),
	]);

	const latestStatusesByMonitorId = new Map<
		string,
		Map<string, WorkerStatusSnapshot>
	>();

	for (const workerStatus of latestWorkerStatuses) {
		const statusesForMonitor =
			latestStatusesByMonitorId.get(workerStatus.monitorId) ?? new Map();
		statusesForMonitor.set(workerStatus.location, {
			status: normalizeMonitorStatus(workerStatus.status),
			timestamp: workerStatus.timestamp,
		});
		latestStatusesByMonitorId.set(workerStatus.monitorId, statusesForMonitor);
	}

	const statusesByMonitorId = new Map<string, AggregateMonitorStatusResult>();

	for (const monitorRecord of monitors) {
		const effectiveWorkers = workersByMonitorId.get(monitorRecord.id) ?? [];
		statusesByMonitorId.set(
			monitorRecord.id,
			getAggregateMonitorStatus({
				configuredWorkerIds: effectiveWorkers.map(
					(workerRecord) => workerRecord.id,
				),
				workerStatusById:
					latestStatusesByMonitorId.get(monitorRecord.id) ?? new Map(),
				isUnderMaintenance: activeMaintenanceMonitorIds.has(monitorRecord.id),
			}),
		);
	}

	return statusesByMonitorId;
}

export async function getAggregateMonitorStatusForMonitor(
	monitorRecord: MonitorWorkerAssignment,
	options: {
		activeMaintenanceMonitorIds?: Set<string>;
		activeOnlyWorkers?: boolean;
	} = {},
) {
	const statuses = await getAggregateMonitorStatusesForMonitors(
		[monitorRecord],
		options,
	);
	return (
		statuses.get(monitorRecord.id) ?? {
			status: "pending",
			allWorkersReporting: false,
			states: [],
			allWorkersDownSince: null,
		}
	);
}
