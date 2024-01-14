import { htmlActivateAccount } from '$lib/mail-template';
import { MailService } from '$lib/services/mail.service';

export async function GET() {
	try {
		const mailService = new MailService();
		await mailService.sendMail(
			'email@zeia.ma',
			'Zeia | Account Activation',
			htmlActivateAccount('689123')
		);

		return new Response(JSON.stringify('ok'), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
