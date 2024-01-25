import { htmlActivateAccount } from '$lib/mail-template';
import nodemailer from 'nodemailer';

export async function GET() {
	try {
		const transporter = nodemailer.createTransport({
			host: 'live.smtp.mailtrap.io',
			port: 587,
			auth: {
				user: 'api',
				pass: '3ca9e48c432bb334c215cf63417b57d0'
			}
		});
		await transporter.sendMail({
			from: 'support@zeia.ma',
			sender: 'support@zeia.ma',
			to: 'maroc.develop@gmail.com',
			subject: 'Zeia | Account Activation',
			html: htmlActivateAccount('689123')
		});

		return new Response(JSON.stringify('ok'), {
			status: 200
		});
	} catch (error: any) {
		return new Response(`Expect test connection with database:  ${error.message}`, {
			status: 500
		});
	}
}
