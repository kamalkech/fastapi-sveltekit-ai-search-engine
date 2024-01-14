import nodemailer from 'nodemailer';

export class MailService {
	private transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465, // 587,
		secure: true,
		auth: {
			user: 'z3878908@gmail.com',
			pass: 'cnkssnhbsjbfnhlu'
		}
	});

	constructor() {
		this.transporter.verify(async (error, success) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Server is ready to take messages');
			}
		});
	}

	async sendMail(to: string, subject: string, html: string) {
		try {
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
