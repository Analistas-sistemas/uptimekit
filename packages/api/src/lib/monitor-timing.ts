import { z } from "zod";

export const monitorTimingSchema = {
	interval: z.coerce.number().int().min(10).default(60),
	timeout: z.coerce.number().int().min(1).max(300).default(48),
	retries: z.coerce.number().int().min(0).max(10).default(2),
	retryInterval: z.coerce.number().int().min(1).max(300).default(20),
};

export function withMonitorTimingRelations<T extends z.ZodType>(schema: T) {
	return schema.refine(
		(data) => {
			const timing = data as { interval: number; retryInterval: number };
			return timing.retryInterval <= timing.interval;
		},
		{
			message:
				"Retry interval must be less than or equal to the heartbeat interval",
			path: ["retryInterval"],
		},
	);
}

export const monitorTimingObjectSchema = withMonitorTimingRelations(
	z.object(monitorTimingSchema),
);

export const monitorTimingDefaults = z.object(monitorTimingSchema).parse({});
