// export async function POST({ request, cookies }) {
export async function POST({ cookies }) {
	try {
		const one_year = 60 * 60 * 24 * 365;

		// const theme = cookies.get('theme') ?? 'light';
		const current_theme = cookies.get('theme');
		const theme = current_theme === 'light' ? 'dark' : 'light';

		cookies.set('theme', theme, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: one_year
		});

		return new Response('ok');
	} catch (error: any) {
		return new Response(JSON.stringify(error.message), {
			status: 500
		});
	}
}
