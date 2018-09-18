const Discord = require('discord.js')
const { prefix } = require('../config.js')

async function run(client, message, arguments) {
    if (message.mentions.members.size === 0) {
        message.reply('Please specify one or more users to kick.').catch(() => {})
        return
    }
    let reason = message.content.replace(/<@(!)?[0-9]{18}>/g, '').replace(`${prefix}kick`, '').trim()

    let completeKick = message.mentions.members.map(async member => {

        const embed = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()
        if (!member.kickable) {
            embed
                .setColor(0x990000)
                .setDescription(`I dont have permission to kick ${member}!`)
            message.channel.send({ embed }).catch(() => {})
            return
        }

        try {
            let kick = await member.kick(`Kicked by ${message.author.username}#${message.author.discriminator} (${message.member.displayName})${reason ? ': ' + reason : ''}`)
            embed
                .setColor(0x009900)
                .setDescription(`Kicked ${member.user.username}#${member.user.discriminator} (${member.displayName})`)
            message.channel.send({ embed }).catch(() => {})
            return kick
        } catch (err) {
            embed
                .setColor(0x990000)
                .setDescription(`Failed to kick ${member.user.username}#${member.user.discriminator} (${member.displayName})`)
            message.channel.send({ embed }).catch(() => {})
        }
    })
    await Promise.all(completeKick)
}

const info = 'Kick one or more users.'
const usage = 'm!kick *{one or more user tags.} {reason}*'

module.exports = { run, info, usage }