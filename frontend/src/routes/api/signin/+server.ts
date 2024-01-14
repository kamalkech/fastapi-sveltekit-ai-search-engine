import { AuthService } from '$lib/services';

// export async function POST({ request, cookies }) {
export async function POST({ request, cookies }) {
	try {
		const { email, password } = await request.json();

		const authService = new AuthService();
		const { token } = await authService.singin(email, password);

		cookies.set('zeia_token', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		// await new Promise((f) => setTimeout(f, 5000)); // sleep for 5 seconds
		return new Response(JSON.stringify({ token }), {
			status: 200
		});
	} catch (error: any) {
		await new Promise((f) => setTimeout(f, 5000)); // sleep for 5 seconds
		return new Response(JSON.stringify(error.message), {
			status: 500
		});
	}
}
