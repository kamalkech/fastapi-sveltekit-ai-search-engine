export class UserCreateDto {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	code: string;

	constructor(firstname: string, lastname: string, email: string, password: string, code: string) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.code = code;
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
		code: string
	) {
		super(firstname, lastname, email, password, code);
		this.id = id;
	}
}
