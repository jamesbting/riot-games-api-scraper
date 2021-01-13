const fs = require('fs')
const _ = require('lodash')
const config = require('config')
const date = new Date()
const filePath = `${config.get('writeToFile.path')}-${date.getUTCFullYear()}-${date.getUTCDate()}.csv`
const encoding = config.get('writeToFile.encoding')
const flatten = require('flat').flatten

function startup(visitedMatches) {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,'',encoding)
    } else {
        const contents = fs.readFileSync(filePath, encoding)
        const matches = contents.split('\n')
        matches.forEach((line) => visitedMatches.add(line.split(',')[0]))
    }
}


function write(body) {
    if(!config.get('writeToFile.enabled') || (body.gameType !== 'CLASSIC' && body.mapId !== 1)) {
        return
    }
    const cleanedBody = _.cloneDeep(body)
    if(config.get('writeToFile.hideIdentities')) {
        delete cleanedBody.participantIdentities
    }
    const flattenedBody = flatten(cleanedBody)
    try{
        fs.appendFileSync(filePath, buildString(flattenedBody), encoding)
        console.log(`Finished writing match ${flattenedBody.gameId}. Moving on to the next match.`)
    } catch(err) {
        throw err
    }

}

function buildString(flattenedObject) {
    const res = []
    Object.values(flattenedObject).forEach((element) =>
        res.push(element)
    )
    return res.join(',') + '\n'
}

module.exports = {write, startup}