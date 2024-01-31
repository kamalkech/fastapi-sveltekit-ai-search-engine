export class AuthSingupDto {
	firstname: string;
	lastname: string;
	email: string;
	password: string;

	constructor(firstname: string, lastname: string, email: string, password: string) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
	}
}

export class AuthSinginDto {
	email: string;
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
