export class HelperService {
	generateActivationCode(): number {
		const min = 100000; // Minimum 6-digit number
		const max = 999999; // Maximum 6-digit number

		// Generate a random number between min and max (inclusive)
		const activationCode = Math.floor(Math.random() * (max - min + 1)) + min;

		// Convert the number to a string and return
		return activationCode;
	}
}
