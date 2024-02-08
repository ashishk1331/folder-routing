export default function Home(request) {
	console.log(request.query);
	return {
		"route": "Home",
	};
}
