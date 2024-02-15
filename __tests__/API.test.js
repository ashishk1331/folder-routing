// Libs
import { describe, test, expect, expectTypeOf } from "vitest";
import request from "supertest";

// Helper
import { getApp } from "../src/index.js";

const app = await getApp();

describe("Normal Routes", async () => {
	test("GET / JSON", async () => {
		const response = await request(app)
			.get("/")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expect(response.body.route).toEqual("Home");
	});

	test("GET /products JSON", async () => {
		const response = await request(app)
			.get("/products")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expect(response.body.route).toEqual("Product");
	});
});

describe("Dynamic Routes", async () => {
	test("GET /products/:id/about JSON", async () => {
		const response = await request(app)
			.get("/products/oven/about")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expect(response.body.about).toEqual("oven");
	});
});

describe("Catch-all Segment Routes", async () => {
	test("GET /products/kitchen/* JSON", async () => {
		const response = await request(app)
			.get("/products/kitchen/knife/fork/spoon")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expectTypeOf(response.body.about).toBeArray();
		expect(response.body.about).toEqual(
			expect.arrayContaining(["knife", "fork", "spoon"]),
		);
	});
});

describe("JSON file storage", async () => {
	test("GET /todos JSON-FILE", async () => {
		const response = await request(app)
			.get("/todos")
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expectTypeOf(response.body.about).toBeArray();
	});
});

describe("POST requests", async () => {
	test("POST app/addUser/[id] /addUser/:id JSON", async () => {
		const response = await request(app)
			.post("/addUser/123")
			.send({ id: 987 })
			.set("Accept", "application/json");

		expect(response.headers["content-type"]).toMatch(/application\/json/);
		expect(response.status).toEqual(200);
		expectTypeOf(response.body.about).toBeArray();
	});
});
