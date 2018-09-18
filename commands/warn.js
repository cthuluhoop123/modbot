const redis = require('redis')
const redisClient = redis.createClient()

const Discord = require('discord.js')
const { prefix } = require('../config.js')

async function run(client, message, arguments) {

    if (message.mentions.members.size === 0) {
        message.reply('Please specify one or more users to warn.').catch(() => { })
        return
    }

    let reason = message.content.replace(/<@(!)?[0-9]{18}>/g, '').replace(`${prefix}warn`, '').trim()

    if (!reason) {
        message.reply('Please give a reason for the warning.').catch(() => { })
        return
    }

    redisClient.set(`warnings:${message.guild.id}:${message.author.id}:${(new Date()).getTime()}`, reason, err => {
        if (err) {
            message.reply('There was an error with the database.')
            return
        }

        const reply = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()
        const warning = (new Discord.RichEmbed()).setFooter(`${message.member.displayName} (${message.author.username}#${message.author.discriminator})`).setTimestamp()

        reply
            .setColor(0x009900)
            .setDescription(`${message.mentions.members.array().join(', ')} ${message.mentions.members.size === 1 ? 'has' : 'have'} been warned for: **${reason}**`)
        message.reply({ embed: reply }).catch(() => { })

        message.mentions.members.map(member => {
            warning
                .setColor(0xff0000)
                .setTitle(`You have been warned in ${message.guild.name}`)
                .setDescription(reason)
            member.send({ embed: warning }).catch(() => { })
        })
    })
}

const info = 'Warn one or more users.'
const usage = 'm!warn *{one or more user tags.} {warning}*'

module.exports = { run, info, usage }