// Libs
import { describe, test, expect } from "vitest";
import request from "supertest";

// Helper
import { getApp } from "../src/index.js";

const app = await getApp();

describe("Empty File", async () => {
	test("GET /about ERROR", async () => {
		const response = await request(app)
			.get("/about")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/text\/html/);
		expect(response.status).toEqual(404);
	});
});
