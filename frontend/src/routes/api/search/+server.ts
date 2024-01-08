import { BACKEND_URL } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { text } = await request.json();

		const response = await fetch(BACKEND_URL + '/search_stream', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text
			})
		});

		const result = await response.json();

		return new Response(JSON.stringify(result), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect search and get answer:  ${error.message}`, {
			status: 500
		});
	}
}
