import chalk from "chalk";

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

  print(level = 0) {
    if (level === 0) {
      console.log(".");
    }
    console.log(
      this.space(level, 3, " ") +
        SYMBOLS.l +
        SYMBOLS.bar +
        chalk.italic.magenta("(dir)") +
        " " +
        this.name +
        "/",
    );
    let files = [],
      folders = [];
    for (let file of this.children) {
      if (file.isDirectory) {
        folders.push(file);
      } else {
        files.push(file);
      }
    }

    for (let folder of folders) {
      folder.print(level + 1);
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
  }

  space(level, factor, delimiter) {
    return Array(factor * level)
      .fill(delimiter)
      .join("");
  }
}
