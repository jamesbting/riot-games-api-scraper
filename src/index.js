// get CLI args and parse

const Scraper = require('./scraper')
const config = require('config')
const lineReader = require('line-reader');

const cliArgs = process.argv.slice(2)
const apiKey = cliArgs[0]

lineReader.eachLine(config.get('writeToFile.path'), (line, last) => {
    if(last) {
        const scraper = new Scraper(apiKey, line.split(',')[0])
        setTimeout(() => scraper.scrape(), 1000)
    }
});
