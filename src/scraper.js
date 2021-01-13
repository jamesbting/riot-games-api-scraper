const _ = require('lodash')
const request = require('request-promise')
const config = require('config')
const writer = require('./writer')
const SUMMONER_REGION = config.get('api.summonerRegion')
const MATCH_REGION = config.get('api.matchRegion')

const GET_ACCOUNT_ID_URL = `https://${SUMMONER_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/`
const GET_MATCH_HISTORY_URL = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/`
const GET_MATCH_DATA_URL = `https://${MATCH_REGION}.api.riotgames.com/lol/match/v4/matches/`
class Scraper {
	constructor(apiKey, seedPlayer) {
		this.apiKey = apiKey
		this.currentPlayer = {}
		this.visitedMatches = new Set()
		this.stack = []
		writer.startup(this.visitedMatches)
		this.intialize(seedPlayer)
	}

	async intialize(seedPlayer) {
		await this.getAccountID(seedPlayer)
		await this.getMatchHistory(this.currentPlayer)
	}

	async getAccountID(summonerName) {
		return new Promise((resolve, reject) => {
			request(
				`${GET_ACCOUNT_ID_URL}${summonerName}?api_key=${this.apiKey}`
			)
			.then((body) => {
				const responseBody = JSON.parse(body)
				this.currentPlayer = responseBody.accountId
				resolve()
			})
			.catch((err) => reject(err))

		})
	}

	async getMatchHistory(accountId) {
		return new Promise((resolve, reject) => {
			request(
				`${GET_MATCH_HISTORY_URL}${accountId}?queue=400&queue=420&queue=430&queue=440&api_key=${this.apiKey}`
			)
			.then((body) => {
				const responseBody = JSON.parse(body)
				const matchHistory = responseBody.matches
				matchHistory.forEach((match) => this.stack.push(match.gameId))
				resolve()
			})
			.catch((err) => reject(err))
		})
	}

	async getMatchDataByMatchID(matchID, callback) {
		return new Promise((resolve, reject) => {
			request(`${GET_MATCH_DATA_URL}${matchID}?api_key=${this.apiKey}`)
			.then((body) => {
				const responseBody = JSON.parse(body)
				this.visitedMatches.add(matchID)
				writer.write(responseBody)
				callback(this, responseBody)
				resolve()
			})
			.catch((err) => reject(err))

		})
	}


	async scrape() {
		while(this.stack.length !== 0) {
			const currentMatch = this.stack.pop()
			if(!this.visitedMatches.has(currentMatch)) {
				try{
					await this.getMatchDataByMatchID(currentMatch, Scraper.next)
				} catch(err) {
					console.log('Encountered an error.')
					console.error(err)
					await sleep(config.get('writeToFile.errorTime'))
				}
			}
			await sleep(config.get('writeToFile.pauseTime'))
		}
	}

	static next(scraper, matchData) {
		console.log('Going to the next match...')
		const participants = matchData.participantIdentities
		const n = participants.length
		const selectedParticipant = participants[Math.floor(Math.random() * n)]
		const nextPlayer = selectedParticipant.player
		scraper.getMatchHistory(nextPlayer.currentAccountId)
	}
}


function sleep(ms) {
	return new Promise(resolve => {
		console.log(`Waiting for ${ms} ms...`)
		setTimeout(resolve, ms)
	})
}

module.exports = Scraper
