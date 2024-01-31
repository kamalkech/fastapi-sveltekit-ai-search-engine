export class ChatCreateDto {
	input: string;
	output: string;
	userId: number;

	constructor(input: string, output: string, userId: number) {
		this.input = input;
		this.output = output;
		this.userId = userId;
	}
}
