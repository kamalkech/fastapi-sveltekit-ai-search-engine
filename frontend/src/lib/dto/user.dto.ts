export class UserCreateDto {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	status?: number;

	constructor(
		firstname: string,
		lastname: string,
		email: string,
		password: string,
		status?: number
	) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.status = status;
	}
}
