export const removeCharacters = (sentence: string): string => {
	const charactersToRemove = '"\'}.`,``\n\t';
	return sentence
		.split('')
		.filter((char) => !charactersToRemove.includes(char))
		.join('');
};
