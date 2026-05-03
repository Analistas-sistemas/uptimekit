import { describe, expect, it } from "bun:test";
import { dedupeNotificationConfigs } from "./service";

describe("notification config selection", () => {
	it("deduplicates configs assigned through multiple monitors", () => {
		const first = { id: "notification-1", name: "Primary" };
		const second = { id: "notification-2", name: "Secondary" };
		const duplicate = { id: "notification-1", name: "Duplicate" };

		expect(dedupeNotificationConfigs([first, second, duplicate])).toEqual([
			first,
			second,
		]);
	});
});
