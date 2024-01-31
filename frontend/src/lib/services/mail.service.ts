import { MAILTRAP_USER, MAILTRAP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';

export class MailService {
	private transporter = nodemailer.createTransport({
		host: 'live.smtp.mailtrap.io',
		port: 587,
		auth: {
			user: MAILTRAP_USER,
			pass: MAILTRAP_PASS
		}
	});

	async sendMail(to: string, subject: string, html: string) {
		try {
			this.transporter.verify(async (error, success) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Server is ready to take messages');
				}
			});
			await this.transporter.sendMail({
				from: 'support@zeia.ma',
				sender: 'support@zeia.ma',
				to,
				subject,
				html
			});
		} catch (error) {
			console.log(error);
		}
	}
}
