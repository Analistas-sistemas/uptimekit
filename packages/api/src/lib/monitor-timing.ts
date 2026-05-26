import { z } from "zod";

export const monitorTimingSchema = {
	interval: z.number().int().min(30).default(60),
	timeout: z.number().int().min(1).max(300).default(48),
	retries: z.number().int().min(0).max(10).default(2),
	retryInterval: z.number().int().min(1).max(300).default(20),
};

export const monitorTimingObjectSchema = z.object(monitorTimingSchema);
