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
const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Example app running on: http://localhost:${PORT}`);
});

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

async function get_data(root, prev_path) {
	if (Boolean(root)) {
		prev_path = path.join(prev_path, root.name);
		for (let file of root.children) {
			if (file.isDirectory) {
				await get_data(file, prev_path);
			} else {
				let file_path = path.join(prev_path, file.name);
				let route = get_route(file_path);
				console.log(chalk.green(route));

				const fileUrl = new URL(`file://${path.resolve(file_path)}`);
				let say = await import(fileUrl);
				GET(route, (req, res) => {
					res.send(say.default(route));
				});
			}
		}
	}
}

async function main() {
	console.log(chalk.bgCyan.black("                  "));
	console.log(chalk.bgCyan.black(" (folder-routing) "));
	console.log(chalk.bgCyan.black("                  \n"));

	const folder_name = path.join(cwd(), "app");
	const root = new Folder("app", []);
	await get_files(folder_name, root);
	console.log(title("Folder Structure:"));
	root.print();

	console.log(title("Routes:"));
	await get_data(root, cwd());
}

main();
