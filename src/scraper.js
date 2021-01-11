const _ = require('lodash')
const request = require('request-promise')
const config = require('config')
const writer = require('./writer')
const ACCOUNT_REGION = config.get('api.accountRegion')
const SUMMONER_REGION = config.get('api.summonerRegion')
const MATCH_REGION = config.get('api.matchRegion')

const GET_PUUID_BY_RIOT_ID_URL = `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/`
const GET_ACCOUNT_ID_URL = `https://${SUMMONER_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/`
const GET_MATCH_HISTORY_URL = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/`
const GET_MATCH_DATA_URL = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v4/matches/`
class Scraper {
	constructor(apiKey, seedPlayer) {
		this.apiKey = apiKey
		this.currentPlayer = _.cloneDeep(seedPlayer)
		this.intializeValues()
		writer.startup()
	}

	async intializeValues() {
		await this.getPUUID()
		await this.getAccountID()
		await this.getMatchHistory()
		await this.getMatchDataByMatchID(3601411033)
	}

	async getPUUID() {
		return new Promise((resolve, reject) => {
			request(
				`${GET_PUUID_BY_RIOT_ID_URL}${this.currentPlayer.gameName}/${this.currentPlayer.tagLine}?api_key=${this.apiKey}`
			)
				.catch((err) => reject(err))
				.then((body) => {
					this.currentPlayer.puuid = JSON.parse(body).puuid
					resolve()
				})
		})
	}

	async getAccountID() {
		return new Promise((resolve, reject) => {
			request(
				`${GET_ACCOUNT_ID_URL}${this.currentPlayer.puuid}?api_key=${this.apiKey}`
			)
				.catch((err) => reject())
				.then((body) => {
					const responseBody = JSON.parse(body)
					this.currentPlayer.accountId = responseBody.accountId
					resolve()
				})
		})
	}

	async getMatchHistory() {
		return new Promise((resolve, reject) => {
			request(
				`${GET_MATCH_HISTORY_URL}${this.currentPlayer.accountId}?api_key=${this.apiKey}`
			)
				.catch((err) => reject())
				.then((body) => {
					const responseBody = JSON.parse(body)
					this.currentPlayer.matchHistory = responseBody.matches
					resolve()
				})
		})
	}

	async getMatchDataByMatchID(matchID) {
		return new Promise((resolve, reject) => {
			request(`${GET_MATCH_DATA_URL}${matchID}?api_key=${this.apiKey}`).catch((err) => reject(err)).then((body) => {
				const responseBody = JSON.parse(body)
				writer.write(responseBody)
				resolve()
			})
		})
	}

	scrape() {}
}

module.exports = Scraper
