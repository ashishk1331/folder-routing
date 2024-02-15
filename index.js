#!/usr/bin/env node

// Libs
import express from "express";
import chalk from "chalk";

// Components
import { getApp, showTree } from "./src/index.js";

// Helper
import { get_adapters } from "./src/util/network.js";

async function main() {
	const START_TIME = Date.now();

	const PORT = process.env.PORT || 3000;
	const app = await getApp();
	app.listen(PORT);

	let addrs = get_adapters();
	for(const each of addrs){
		app.listen(PORT, each);
	}

	const END_TMIE = Date.now();

	const TIME_ELAPSED = END_TMIE - START_TIME;
	console.clear();
	console.log(
		chalk.italic.bgCyan.black(" (folder-routing) "),
		chalk.cyan("v" + "0.2.0"),
		chalk.gray("ready in"),
		chalk.white(TIME_ELAPSED),
		chalk.gray("ms"),
		"\n",
	);

	console.group();
	console.log("Local \t" + chalk.green(`http://localhost:${PORT}/`));
	// check for network adpaters
	for(const each of addrs){
		console.log("Network \t" + chalk.green(`http://${each}:${PORT}/`));
	}
	console.log(chalk.italic.gray("API is hosted locally."));
	console.groupEnd();

	showTree();

}

main();
