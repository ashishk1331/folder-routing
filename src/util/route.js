import path from "path";

export function get_route(relative_path) {
  // eg:         ./app/products/kitchen/index.js
  // convert to: /app/products/kitchen
  let chunks = relative_path.split(path.sep);

  let index = 0;
  for (var i = 0; i < chunks.length; i++) {
    if (chunks[i] === "app") {
      index = i + 1;
      break;
    }
  }

  let last_index = chunks.length;
  for (var i = 0; i < chunks.length; i++) {
    // variation -> catch-all segment
    if(chunks[i].startsWith("[...") && chunks[i].endsWith("]")){
      chunks[i] = "*";
      last_index = i + 1;
      break;
    }

    // variation -> dynamic routes
    if(chunks[i].startsWith("[") && chunks[i].endsWith("]")){
      chunks[i] = ":" + chunks[i].substr(1, chunks[i].length - 2);
    }

    if(chunks[i] === "index.js" || chunks[i] === "data.json"){
      last_index = i;
      break;
    }
  }

  if (index >= chunks.length) {
    return "/";
  }
  const route = chunks.slice(index, last_index).join("/");
  return (!route.startsWith("/") ? "/" : "") + route;
}

const DYNAMIC_ROUTE = /^\[[\w]+\]$/gm;
const CATCH_ALL_SEGMENT = /^\[...[\w]+\]$/gm;

export function get_folder_route(array) {
  if(array[0] === "app")
    array = array.slice(1);

  let route = [];
  let found_catch = false;
  for(let segment of array){
    if(CATCH_ALL_SEGMENT.test(segment)){
      segment = "*";
      found_catch = true;
    } else if(DYNAMIC_ROUTE.test(segment)){
      segment = ":" + segment.slice(1, segment.length - 1);
    }

    route.push(segment);
    if(found_catch) break;
  }

  return "/" + route.join("/");
}