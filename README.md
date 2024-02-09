![Banner image](banner.png)

# folder-routing

[![Downloads](https://badgers.space/npm/name/folder-routing)](https://www.npmjs.com/package/folder-routing)
![Version](https://badgers.space/npm/version/folder-routing)

> Folder based routing for APIs.

`folder-routing` is a thin wrapper around ExpressJS which is based on folder routing, similar to app router in NextJS.

## Highlights

- Hassle free start-up
- Request and Response objects
- Asynchronous functions
- Various route-types supported
	- Nested Routes
	- Dynamic Routes
	- Catch-all segment routes
- Network-wide hosting
- Beautiful CLI for folder-structure

## Install

1. Initialize the project

	```bash
	npm init -y
	```
	Or you can run it with your personal flags and fashion. Also, the project comes only in ES Modules flavor. 
	**IMPORTANT:** Hence, remember to include `type: module` inside package.json file.

2. Add the dependency

	```bash
	npm install folder-routing
	```
	Add `folder-routing` to the set of main dependency.

3. Start the server
	
	```bash
	npx folder-routing
	```
	Voila! You just ran a folder-routing API. The server will be available across connected networks and the CLI will output the exact address.



## Usage

Whole of the folder-routing revolves around the concept of dividing routes among files and intercept requests to produce results. Every endpoint is represented by a single file.

The framework looks for default export of asynchronous functions, from file named `index.js`, to fill in the response. It uses `express.app.send` under the hood. Thus, JSON, strings and other data type can be handled readily.

Also, the asynchronous nature allows you to make other fetch requests from databases, APIs or even JSON files. Hence, features like rate limiting, API keys and authorization can be implemented easily.

Steps to create an API:

1. the `app` folder,

	The app folder serves as `/` route. Every other sub-directory is the next endpoint. Create `app` folder directly under your root folder.
	Nest folders to create nested routes for the API.

	```
	/
	└── app/
	    ├── users/             # Simple Route
	    │   └── index.js
	    ├── [userID]/          # Dynamic Route
	    │   └── index.js
	    ├── badge/
		│    └── [...rest]/    # Catch-all Segment Route
		│        └── index.js
	    └── index.js
	```

	Types of supported routes:
	+ Normal routes(You already know them)
	+ Dynamic Routes [route_name]
		Enclose folder name within square brackets to convert it into dynamic route which can be accessed under `params` in `request` object.
	+ Catch-all Segments [...route_name]
		It will catch all nested routes after this folder, which can be accessed under `request` object.

	Fancy routes related data can be accessed via request object for more info consult Express Documentation.


2.	the `index.js` file,
	
	Inside of a `index.js` file should be a default export function, which should return the data to be displayed. The function can be `async` in nature.
	The function will get the `request` object as an arguement to the function.

	```js
	export default function Users(request) {
		return [
			{
				id: "abc",
				name: "Ashish Khare",
			},
		];
	}
	```

3. the `npx` command,
	
	Once you're done arranging the data across folders. Run the following command to start up the server.
	
	```bash
	npx folder-routing
	```

	Now, you've a working API.

## TO-DO

- [] add *Args* support(especially for "host across network" feature)
- [] *JSON* file support
- [] tons of *Tests*(API testing)
- [] maybe more *Documentation*
- [] set up the *Website*
- [] [not advised] write custom *HTTP server*

## Maintainers

- [Ashish Khare](https://github.com/ashishk1331)