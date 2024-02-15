// Libs
import express from "express";
import { cwd } from "node:process";
import path from "path";
import { promises as fs } from "fs";

// Helper
import { Folder } from "./class/Folder.js";
import { File } from "./class/File.js";
import { get_route } from "./util/route.js";
import { title } from "./util/banner.js";

// Constants
const METHODS = ["POST", "GET", "PUT", "DELETE"];

async function get_files(folder_name, root) {
	let files;
	try {
		files = await fs.readdir(folder_name, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") {
			console.log('"app" folder not found.');
		}
	}
	for (let file of files) {
		if (file.isDirectory()) {
			let folder = new Folder(file.name);
			root.children.push(folder);
			await get_files(path.join(folder_name, file.name), folder);
		} else {
			root.children.push(new File(file.name));
		}
	}
}

async function get_data(root, prev_path, app) {
	if (Boolean(root)) {
		prev_path = path.join(prev_path, root.name);
		for (let file of root.children) {
			if (file.isDirectory) {
				await get_data(file, prev_path, app);
			} else {
				let file_path = path.join(prev_path, file.name);
				let route = get_route(file_path);

				if (file_path.endsWith("index.js")) {
					const fileUrl = new URL(
						`file://${path.resolve(file_path)}`,
					);
					let say = await import(fileUrl);

					for (let method of METHODS) {
						if (method in say) {
							app[method.toLowerCase()](
								route,
								async (req, res) => {
									let resp = await say[method](req);
									res.send(resp);
								},
							);
						}
					}

					if ("default" in say) {
						// Abides default function
						app.get(route, async (req, res) => {
							let resp = await say.default(req);
							res.send(resp);
						});
					}
				}
				if (file_path.endsWith("data.json")) {
					const fileUrl = new URL(
						`file://${path.resolve(file_path)}`,
					);
					const contents = await fs.readFile(fileUrl, {
						encoding: "utf8",
					});

					app.get(route, async (req, res) => {
						res.send(JSON.parse(contents));
					});
				}
			}
		}
	}
}

let root = null;

async function buildTree() {
	const folder_name = path.join(cwd(), "app");
	root = new Folder("app");
	await get_files(folder_name, root);

	return root;
}

export function showTree() {
	if (Boolean(root)) {
		const width = root.maxWidth();
		console.log(title("Folder Structure:"));
		root.print([], 0, width); // routes array, level, max width of tree
	}
}

export async function getApp() {
	const app = express();
	app.use(express.json());

	const root = await buildTree();

	await get_data(root, cwd(), app);

	return app;
}
