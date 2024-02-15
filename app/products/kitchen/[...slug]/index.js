export default function (request) {
	const slugs = request.params[0].split("/");
	return {
		about: slugs,
	};
}
