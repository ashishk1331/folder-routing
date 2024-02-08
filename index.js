#!/usr/bin/env node

import { promises as fs } from "fs";
import express from "express";
import chalk from "chalk";
import { cwd } from "node:process";
import path from "path";

import { Folder } from "./class/Folder.js";
import { File } from "./class/File.js";
import { get_route } from "./util/route.js";
import { title } from "./util/banner.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT);

function GET(route, fn) {
	app.get(route, fn);
}

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

async function get_data(root, prev_path, routes) {
	if (Boolean(root)) {
		prev_path = path.join(prev_path, root.name);
		for (let file of root.children) {
			if (file.isDirectory) {
				await get_data(file, prev_path, routes);
			} else {
				let file_path = path.join(prev_path, file.name);
				let route = get_route(file_path);
				routes.push(route);

				const fileUrl = new URL(`file://${path.resolve(file_path)}`);
				let say = await import(fileUrl);
				GET(route, (req, res) => {
					res.send(say.default(req));
				});
			}
		}
	}
}

async function main() {
	const START_TIME = Date.now();

	const folder_name = path.join(cwd(), "app");
	const root = new Folder("app", []);
	await get_files(folder_name, root);

	const width = root.maxWidth();

	let routes = [];
	await get_data(root, cwd(), routes);

	const END_TMIE = Date.now();

	const TIME_ELAPSED = END_TMIE - START_TIME;
	console.clear();
	console.log(
		chalk.italic.bgCyan.black(" (folder-routing) "),
		chalk.cyan("v0.0.3"),
		chalk.gray("ready in"),
		chalk.white(TIME_ELAPSED),
		chalk.gray("ms"),
		"\n",
	);

	console.group();
	console.log("Local \t" + chalk.green(`http://localhost:${PORT}/`));
	console.log(chalk.italic.gray("API is hosted locally."));
	console.groupEnd();

	console.log(title("Folder Structure:"));
	root.print([], 0, width); // routes array, level, max width of tree
}

main();
