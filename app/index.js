export default async function Home(request) {
	let resp = await fetch("https://jsonplaceholder.typicode.com/todos/1");
	resp = await resp.json();
	return {
		route: resp,
	};
}
