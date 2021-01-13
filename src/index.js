/* eslint-disable semi */
// get CLI args and parse

const Scraper = require('./scraper')

const cliArgs = process.argv.slice(2) // should be: [API key, seed name]
const apiKey = cliArgs[0]
const seedPlayer = cliArgs[1]

const scraper = new Scraper(apiKey, seedPlayer)
setTimeout(() => scraper.scrape(), 1000)
