export default async function(request) {
	let resp = await fetch("https://jsonplaceholder.typicode.com/comments");
	resp = await resp.json();
	resp = resp.slice(0, 3);

	return {
		"comments": resp,
		"length": resp.length,
	}
}