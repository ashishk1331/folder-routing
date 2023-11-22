import { promises as fs } from "fs";
import express from "express";

class Folder {
  constructor(name, children = []) {
    this.name = name;
    this.children = children;
    this.isDirectory = true;
  }

  print(level = 0) {
    console.log(this.space(level, 3, "-"), "(dir)", this.name);
    for (let file of this.children) {
      if (file.isDirectory) {
        file.print(level + 1);
      } else {
        console.log(this.space(level + 1, 3, "-"), file.name);
      }
    }
  }

  space(level, factor, delimiter) {
    return Array(factor * level)
      .fill(delimiter)
      .join("");
  }
}

class File {
  constructor(name) {
    this.name = name;
    this.isDirectory = false;
  }
}

async function get_files(folder_name, root) {
  let files = await fs.readdir(folder_name, { withFileTypes: true });
  for (let file of files) {
    if (file.isDirectory()) {
      let folder = new Folder(file.name);
      root.children.push(folder);
      await get_files(`${folder_name}/${file.name}`, folder);
    } else {
      root.children.push(new File(file.name));
    }
  }
}

async function get_data(root, path = "./", app) {
  if (Boolean(root)) {
    path += root.name + "/";
    for (let file of root.children) {
      if (file.isDirectory) {
        await get_data(file, path, app);
      } else {
        let file_path = path + file.name;
        let route =
          file_path.substring(
            file_path.indexOf("app") + 3,
            file_path.indexOf("/index"),
          ) || "/";
        console.log("\nroute:", route);

        let say = await import(file_path);
        let text = say.default();
        app.get(route, (req, res) => {
          res.send(text);
        });
        console.log("text:", text);
      }
    }
  }
}

async function main() {
  const app = express();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Example app running on: http://localhost:${port}`);
  });

  const folder_name = "app";
  const root = new Folder(folder_name, []);
  await get_files(folder_name, root);
  console.log("\nFolder Structure:");
  root.print();

  await get_data(root, "./", app);
}

main();
