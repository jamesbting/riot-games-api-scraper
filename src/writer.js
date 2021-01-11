const fs = require('fs')
const config = require('config')
const date = new Date()
const filePath = `${config.get('writeToFile.path')}-${date.getUTCFullYear()}-${date.getUTCDate()}.csv`
const encoding = config.get('writeToFile.encoding')
const flatten = require('flat').flatten
function startup() {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,'',encoding)
    }
}


function write(body) {
    if(!config.get('writeToFile.enabled')) return
    const flattenedBody = flatten(body)
    try{
        fs.appendFileSync(filePath, buildString(flattenedBody), encoding)
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