import { dev } from '$app/environment';

export async function POST({ cookies, request }) {
	try {
		const { key } = await request.json();

		cookies.set('openai_key', key, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		return new Response('ok', { status: 200 });
	} catch (error) {
		console.error('Expect search and get answer:', error);
		return new Response(`Expect search and get answer: ${error}`, { status: 500 });
	}
}
