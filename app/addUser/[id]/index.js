export function POST(req) {
	const id = req.params.id;
	
	return {
		status: "User added: " + id,
		error: false,
	};
}
