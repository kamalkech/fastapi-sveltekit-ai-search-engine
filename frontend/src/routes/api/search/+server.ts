let url = 'http://backend:3333/search_stream';
if (process.env.NODE_ENV === 'development') {
	url = 'http://127.0.0.1:8000/search_stream';
}
console.log(url);

export async function POST({ cookies, request }) {
	try {
		const openai_key = cookies.get('openai_key');
		if (!openai_key || openai_key === '') {
			return new Response('Missing OpenAI key', { status: 400 });
		}

		const { text } = await request.json();

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text,
				openai_key: openai_key
			})
		});

		const result = await response.json();

		return new Response(JSON.stringify(result), {
			status: 200
		});
	} catch (error: any) {
		console.error(`Expect search and get answer 1: ${url}`, error);
		return new Response(`Expect search and get answer 2: ${url} /  ${error.message}`, {
			status: 500
		});
	}
}
