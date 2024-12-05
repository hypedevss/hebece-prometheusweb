export default async function (json: string) {
	const jsonSplit = json.split('\n');
	const fixedJson = [];
	jsonSplit.forEach((line, index) => {
		let modifiedLine = line;
		modifiedLine = modifiedLine
				.replace(/(\w+)\s*:/g, '"$1":')
				.replaceAll('""', "")
				.replaceAll("https\"", "\"https")
		  		.replaceAll("'\"\"", "\"")
				.replace(/"serverDate":\s*[^,}]+,?\s*/g, '')
		  		.replaceAll("'", "\"")
		fixedJson.push(modifiedLine);
	});
	return JSON.parse(fixedJson.join('\n'));
}