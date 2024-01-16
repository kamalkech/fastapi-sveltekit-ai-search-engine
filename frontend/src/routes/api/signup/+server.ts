import { AuthService } from '$lib/services';

// export async function POST({ request, cookies }) {
export async function POST({ request }) {
	try {
		const input = await request.json();
		const authService = new AuthService();
		const user = await authService.signup(input);

		const msg_success = `Your account with email ${user.email} has been created successfully. To activate it, simply copy the 6-digit code from the email sent to you. For any questions, reach out to our support team.`;

		return new Response(JSON.stringify({ msg_success }), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
