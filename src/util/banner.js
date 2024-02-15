import chalk from "chalk";

export function title(title) {
	return "\n" + chalk.cyan(">") + " " + chalk.bold(title);
}