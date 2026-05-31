import { EventEmitter } from "node:events";
import { createLogger } from "./logger";

const logger = createLogger("EVENTS");
const DEFAULT_EVENT_TIMEOUT_MS = 30_000;

export interface AppEvents {
	"incident.created": {
		incidentId: string;
		organizationId: string;
		title: string;
		description?: string | null;
		severity: "minor" | "major" | "critical";
	};
	"incident.acknowledged": {
		incidentId: string;
		organizationId: string;
		title: string;
		description?: string | null;
		severity: "minor" | "major" | "critical";
		userId?: string | null;
	};
	"incident.resolved": {
		incidentId: string;
		organizationId: string;
		title: string;
		description?: string | null;
		severity: "minor" | "major" | "critical";
	};
	"incident.comment_added": {
		incidentId: string;
		organizationId: string;
		title: string;
		message: string;
		severity: "minor" | "major" | "critical";
		userId?: string | null;
	};
	"incident.deleted": {
		incidentId: string;
		organizationId: string;
		title: string;
		severity: "minor" | "major" | "critical";
	};
	"monitor.ssl.expiring": {
		monitorId: string;
		organizationId: string;
		monitorName: string;
		domain: string;
		issuer?: string;
		validFrom?: string;
		validTo?: string;
		daysUntilExpiry: number;
		isValid: boolean;
		error?: string;
		threshold: number;
	};
}

export type AppEventName = keyof AppEvents;
export type AppEventPayload<K extends AppEventName> = AppEvents[K];

interface EmitAsyncOptions {
	timeoutMs?: number;
}

function withTimeout<T>(
	promise: Promise<T>,
	timeoutMs: number,
	event: AppEventName,
) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => {
			reject(
				new Error(`Timed out after ${timeoutMs}ms while handling ${event}`),
			);
		}, timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]).finally(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
}

class TypedEventEmitter extends EventEmitter {
	emit<K extends AppEventName>(event: K, payload: AppEvents[K]): boolean {
		return super.emit(event, payload);
	}

	on<K extends AppEventName>(
		event: K,
		listener: (payload: AppEvents[K]) => void | Promise<void>,
	): this {
		return super.on(event, listener);
	}

	off<K extends AppEventName>(
		event: K,
		listener: (payload: AppEvents[K]) => void | Promise<void>,
	): this {
		return super.off(event, listener);
	}

	async emitAsync<K extends AppEventName>(
		event: K,
		payload: AppEvents[K],
		options: EmitAsyncOptions = {},
	) {
		const listeners = this.listeners(event) as Array<
			(payload: AppEvents[K]) => void | Promise<void>
		>;
		const timeoutMs = options.timeoutMs ?? DEFAULT_EVENT_TIMEOUT_MS;

		const results = await Promise.allSettled(
			listeners.map((listener) =>
				withTimeout(Promise.resolve(listener(payload)), timeoutMs, event),
			),
		);

		for (const result of results) {
			if (result.status === "rejected") {
				logger.error(`Event listener failed for ${event}`, result.reason);
			}
		}

		return results;
	}
}

export const eventBus = new TypedEventEmitter();
