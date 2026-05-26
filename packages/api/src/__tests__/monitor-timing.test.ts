import { describe, expect, it } from "bun:test";
import { monitorTimingObjectSchema } from "../lib/monitor-timing";

describe("monitor timing validation", () => {
	it("applies the default timing controls", () => {
		expect(monitorTimingObjectSchema.parse({})).toEqual({
			interval: 60,
			timeout: 48,
			retries: 2,
			retryInterval: 20,
		});
	});

	it("accepts values at the configured bounds", () => {
		expect(
			monitorTimingObjectSchema.parse({
				interval: 30,
				timeout: 300,
				retries: 0,
				retryInterval: 1,
			}),
		).toEqual({
			interval: 30,
			timeout: 300,
			retries: 0,
			retryInterval: 1,
		});
	});

	it("rejects values outside the configured bounds", () => {
		const result = monitorTimingObjectSchema.safeParse({
			interval: 29,
			timeout: 301,
			retries: 11,
			retryInterval: 0,
		});

		expect(result.success).toBe(false);
	});
});
