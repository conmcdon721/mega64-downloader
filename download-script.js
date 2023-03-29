const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const directory = require("./archive-directory.json");

const downloader = async (i) => {
	for (let i = 1; i <= 405; i++) {
		console.log(`This is iteration number ${i}.`);

		let padded = i.toString().padStart(4, 0);
		console.log(`Looking for podcast (padded): ${padded}`);

		let lookupvalue = `Podcast ${i}`;
		let date = directory[lookupvalue];
		console.log(`It was broadcast on ${date}`);

		let url = `https://mega64.org/archives/main-shows-audio/${padded}%20${date}%20Audio.mp4`;
		console.log(`It can be found at the following url:\n${url}`);

		console.log("Executing download.");

		const promisedPiping = new Promise((resolve, reject) => {
			const file = fs.createWriteStream(`${lookupvalue}.mp4`);
			const request = https.get(url, function (response) {
				response.pipe(file);

				// after download completed close filestream
				file.on("finish", () => {
					file.close();
					console.log(`Download ${i} complete`);
					resolve();
				});

				file.on("error", () => {
					console.log(`Ah, fuck`);
					reject();
				});
			});
		});

		await promisedPiping;
	}
};

downloader();

