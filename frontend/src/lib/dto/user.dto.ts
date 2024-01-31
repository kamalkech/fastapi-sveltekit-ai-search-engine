export class UserCreateDto {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	code: string;
	status: number;

	constructor(
		firstname: string,
		lastname: string,
		email: string,
		password: string,
		code: string,
		status: number
	) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.code = code;
		this.status = status;
	}
}
export class UserUpdateDto extends UserCreateDto {
	id: string;

	constructor(
		id: string,
		firstname: string,
		lastname: string,
		email: string,
		password: string,
		code: string,
		status: number
	) {
		super(firstname, lastname, email, password, code, status);
		this.id = id;
	}
}
