export const removeCharacters = (sentence: string): string => {
	const charactersToRemove = '"\'}.`,``\n\t';
	return sentence
		.split('')
		.filter((char) => !charactersToRemove.includes(char))
		.join('');
};

// async function sendToBackend(file: Blob): Promise<void> {
// 	try {
// 		const formData = new FormData();
// 		formData.append('lng', 'ar');
// 		formData.append('file', file, 'my-audio.wav');
// 		const response = await axios.post(BACKEND_URL + '/search_stream', formData, {
// 			headers: {
// 				'Content-Type': 'multipart/form-data'
// 			},
// 			responseType: 'blob'
// 		});
//
// 		if (response) {
// 			audioUrl = URL.createObjectURL(response.data);
// 			new Audio(audioUrl).play();
// 		}
// 	} catch (error) {
// 		console.error(`Failed to transcribe text, error: ${error}`);
// 	O
// 	}
