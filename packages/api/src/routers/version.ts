import { z } from "zod";
import packageJson from "../../../../package.json";
import { publicProcedure } from "../index";

export const getVersion = publicProcedure
	.route({
		method: "GET",
		path: "/version",
		tags: ["System"],
		summary: "Get version",
		description: "Retrieve the UptimeKit version from the root package.json.",
	})
	.output(z.object({ version: z.string() }))
	.handler(() => ({
		version: packageJson.version,
	}));
