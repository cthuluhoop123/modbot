
const redis = require('redis')
const redisClient = redis.createClient()

const { promisify } = require('util')
const smembersAsync = promisify(redisClient.smembers).bind(redisClient)

function run(client, message) {
    return new Promise(async (resolve, reject) => {
        let swearList = await smembersAsync('swearList')
        let hasSwears = message.content.split(' ').some(word => {
            return swearList.includes(word)
        })
        if (hasSwears) {
            message.delete().catch(() => {})
        }
        resolve()
    })
}

const info = 'Censors swears.'

module.exports = { run, info }