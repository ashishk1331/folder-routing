import path from "path";

export function get_route(relative_path) {
  // eg:         ./app/products/kitchen/index.js
  // convert to: /app/products/kitchen
  let chunks = relative_path.split(path.sep);
  chunks.pop();
  let index = 0;
  for (var i = 0; i < chunks.length; i++) {
    if (chunks[i] === "app") {
      index = i + 1;
      break;
    }
  }

  if (index >= chunks.length) {
    return "/";
  }

  return "/" + chunks.slice(index).join("/");
}
