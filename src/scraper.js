const _ = require('lodash')
const request = require('request-promise')
const config = require('config')

const REGION = config.get('region')

const GET_ACCOUNT_BY_RIOT_ID_URL = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`

class Scraper {
	constructor(apiKey, seedPlayer) {
		this.apiKey = apiKey
		this.currentPlayer = _.cloneDeep(seedPlayer)
		request(
			`${GET_ACCOUNT_BY_RIOT_ID_URL}${this.currentPlayer.gameName}/${this.currentPlayer.tagLine}?api_key=${this.apiKey}`
		)
			.catch((err) => {
				throw err
			})
			.then((body) => {
				this.currentPlayer.puuid = JSON.parse(body).puuid
			})
	}

	scrape() {}
}

module.exports = Scraper
