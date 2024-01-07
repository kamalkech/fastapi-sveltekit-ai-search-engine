export const removeCharacters = (sentence: string): string => {
	const charactersToRemove = '"\'}.`,``';
	return sentence
		.split('')
		.filter((char) => !charactersToRemove.includes(char))
		.join('');
};
