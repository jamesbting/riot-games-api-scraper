const fs = require('fs')
const _ = require('lodash')
const config = require('config')
const date = new Date()
const filePath = config.get('writeToFile.path')
const encoding = config.get('writeToFile.encoding')
const flatten = require('flat').flatten

function startup() {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,'',encoding)
    }
}


function write(body) {
    if(!config.get('writeToFile.enabled')) {
        return
    }
    const cleanedBody = _.cloneDeep(body)
    if(config.get('writeToFile.hideIdentities')) {
        delete cleanedBody.participantIdentities
    }

    if(config.get('writeToFile.removeTimelines')) {
        cleanedBody.participants.forEach((participant) => {
            delete participant.timeline
            delete participant.masteries
        })
    }
    const flattenedBody = flatten(cleanedBody)
    try{
        fs.appendFileSync(filePath, buildString(flattenedBody), encoding)
        console.log(`Finished writing match ${flattenedBody.gameId}.`)
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

