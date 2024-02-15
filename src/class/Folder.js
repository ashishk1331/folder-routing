import chalk from "chalk";
import { get_folder_route } from "../util/route.js";

let SYMBOLS = {
  t: "├",
  bar: "─",
  l: "└",
  pipe: "│",
};

export class Folder {
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
    this.isDirectory = true;
  }

  maxWidth(level = 0) {
    let files = [],
      folders = [];
    for (let file of this.children) {
      if (file.isDirectory) {
        folders.push(file);
      } else {
        files.push(file);
      }
    }

    let width = 0;

    const FOLDER_WIDTH =
      level * 3 + // whitespaces
      2 + // 'L' + '-'
      5 + // (dir)
      1 + // space before name
      this.name.length;

    width = Math.max(width, FOLDER_WIDTH);

    for (let folder of folders) {
      width = Math.max(width, folder.maxWidth(level + 1));
    }

    for (let file of files) {
      const FILE_WIDTH =
        (level + 1) * 3 + // whitespaces
        3 + // 'L' + '-' + space between
        file.name.length; // file name
      width = Math.max(width, FILE_WIDTH);
    }

    return width;
  }

  print(route = [], level = 0, width = 80) {
    route.push(this.name);
    if (level === 0) {
      console.log(".");
    }

    let files = [],
      folders = [];

    let found_index_js = false;
    for (let file of this.children) {
      if (file.name === "index.js" || file.name === "data.json") {
        found_index_js = true;
      }
      if (file.isDirectory) {
        folders.push(file);
      } else {
        files.push(file);
      }
    }

    const FOLDER_NAME =
      this.space(level, 3, " ") +
      SYMBOLS.l +
      SYMBOLS.bar +
      chalk.italic.magenta("(dir)") +
      " " +
      this.name;
    const FOLDER_WIDTH = level * 3 + 8 + this.name.length;

    console.log(
      FOLDER_NAME,
      this.space(width - FOLDER_WIDTH, 1, " "),
      "\t",
      found_index_js ? chalk.green(get_folder_route(route)) : "",
    );

    for (let folder of folders) {
      folder.print(route, level + 1, width);
    }

    for (let file of files) {
      console.log(
        this.space(level + 1, 3, " ") +
          SYMBOLS.l +
          SYMBOLS.bar +
          " " +
          file.name,
      );
    }
    route.pop();
  }

  space(level, factor, delimiter) {
    return Array(factor * level)
      .fill(delimiter)
      .join("");
  }
}
