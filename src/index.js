/* eslint-disable semi */
// get CLI args and parse

const Scraper = require('./scraper')

const cliArgs = process.argv.slice(2) // should be: [API key, seed name, tagline]
const apiKey = cliArgs[0]
const seedPlayer = {
	gameName: cliArgs[1],
	tagLine: cliArgs[2],
}

const scraper = new Scraper(apiKey, seedPlayer)
