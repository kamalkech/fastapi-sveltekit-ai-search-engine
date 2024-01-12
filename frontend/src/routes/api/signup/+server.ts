import { UserService } from '$lib/services';

// export async function POST({ request, cookies }) {
export async function GET({ request, cookies }) {
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

		return new Response(JSON.stringify(token), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
