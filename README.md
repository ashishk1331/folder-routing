# folder-routing

[![Downloads](https://badgers.space/npm/name/folder-routing)](https://www.npmjs.com/package/folder-routing)
![Version](https://badgers.space/npm/version/folder-routing)

> Folder based routing for APIs.

Built upon expressJS. More like NextJS app router.
Create folders for routes and use default exports from the JS files to serve data to that route.

## Highlights

- Hassle free start-up

## Install

```sh
npm install folder-routing
```

**IMPORTANT:** folder-routing is ESM. Hence set `type: module` inside package.json file.


## Usage

1.	Start by creating `app` folder directly under your root folder. App serves as the starting point for your API.
	Data returned from the index.js files as default exported functions is served at the endpoints.
	Nest folders to create nested routes for the API.

	```
	/
	└── app/
	    ├── users/
	    │   └── index.js
	    └── index.js
	```

2.	Inside of a `index.js` file, should be a default export function.
	The function will get the route as an arguement to the function.

	```js
	export default function Home(route) {
		return "Products";
	}
	```

3. Then start the server with
	
	```sh
	npx folder-routing
	```

	And Voila!

## Maintainers

- [Ashish Khare](https://github.com/ashishk1331)