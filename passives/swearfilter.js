
const redis = require('redis')
const redisClient = redis.createClient()

function run(client, message) {
    return new Promise(async (resolve, reject) => {
        redisClient.smembers('swearList', (err, swearList) => {
            let hasSwears = message.content.split(' ').some(word => {
                return swearList.includes(word)
            })
            if (hasSwears) {
                message.delete().catch(() => { })
            }
            resolve()
        })
    })
}

const info = 'Censors swears.'

module.exports = { run, info }