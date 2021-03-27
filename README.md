# riot-games-api-scraper
A NodeJS script that is designed to poll match data from the Riot API. The program will wait between each request (and each failed request) in order to not trigger a too many requests error.

The program expects a match ID in first column and last row of the file in which data is written.  The scraper roughly follows a pseudo-DFS of the matches and players, and follows the pseudo code below:

```
s = new Stack()
firstMatchID = readFromFile()
visitedMatches = new HashMap()
s.push(firstMatchID)
while s is not empty
	currMatch = stack.pop()
	data = getMatchDataAndWriteToFile(currMatch)
	participant = selectRandomParticipant(data)
	for match in getMatchHistory(participant):
		s.push(match.matchID)	
```

## Installation

Before running the program, ensure you have the following dependencies installed. 

- NodeJS 14.15.3
- npm 6.14.9

This program also relies on the following dependencies:

- config 3.3.3
- flat 5.0.2
- js-yaml 4.0.0
- line-reader 0.4.0
- lodash 4.17.20
- request 2.88.2
- request-promise 4.2.6

You can run ```npm install``` to install them all automatically, or install them one by one. 

## Before running

Before running the program, ensure that the file location is correct in the default.yaml file. Here you can also configure the behavior of the program, including which regions to scrape.

## Running the program

To run the program, go to the location that the repository is located, and issue the following command:

```
node src/index.js <API KEY>
```

where API Key is your Riot Games API key. If running on Linux, you can run the screen command to keep it running in the background.