import { UserService } from '$lib/services';

// export async function POST({ request, cookies }) {
export async function POST({ request }) {
	try {
		const { email, code } = await request.json();

		const userService = new UserService();
		await userService.active(email, code);

		return new Response(JSON.stringify({ msg: 'Your account activated successfully' }), {
			status: 200
		});
	} catch (error: any) {
		return new Response(JSON.stringify(error.message), {
			status: 500
		});
	}
}
