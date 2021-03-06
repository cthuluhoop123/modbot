const redis = require('redis')
const redisClient = redis.createClient()

const { join } = require('path')

const fs = require('fs')
const Discord = require('discord.js')


const availablePassives = fs.readdirSync(join(__dirname, '../passives')).map(passive => {
    return passive.substring(0, passive.length - 3)
})

function run(client, message, arguments) {
    const embed = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()
    if (arguments.length === 0) {
        message.reply('Please specify a passive!').catch(() => {})
        return
    }

    if (!availablePassives.includes(arguments[0])) {
        message.reply('No passive found!').catch(() => {})
        return
    }

    if (!arguments[1] || arguments[1] === 'on') {
        redisClient.lrem(`passives:${message.guild.id}`, 0, arguments[0])
        redisClient.rpush(`passives:${message.guild.id}`, arguments[0])
        embed
            .setColor(0x009900)
            .setDescription(`${arguments[0]} is now **on**`)
        message.reply({ embed }).catch(() => {})
    } else {
        redisClient.lrem(`passives:${message.guild.id}`, 0, arguments[0])
        embed
            .setColor(0x009900)
            .setDescription(`${arguments[0]} is now **off**`)
        message.reply({ embed }).catch(() => {})
    }
}

const info = 'Turn a passive on or off.'
const usage = 'Use **m!passive *{passive name} {on | off}*** to turn passive on or off.'

module.exports = { run, info, usage }