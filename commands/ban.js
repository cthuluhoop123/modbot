const Discord = require('discord.js')
const { prefix } = require('../config.js')

async function run(client, message, arguments) {
    if (message.mentions.members.size === 0) {
        try {
            message.reply('Please specify one ore more users to ban.')
            return
        } catch (e) { }
    }
    let reason = message.content.replace(/<@(!)?[0-9]{18}>/g, '').replace(`${prefix}ban`, '').trim()

    let completeBan = message.mentions.members.map(async member => {

        const embed = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()

        if (!member.bannable) {
            embed
                .setColor(0x990000)
                .setDescription(`I don't have permission to ban ${member}!`)
            message.channel.send({ embed })
            return
        }

        try {
            let ban = await member.ban(`Banned by ${message.author.username}#${message.author.discriminator} (${message.member.displayName})${reason ? ': ' + reason : ''}`)
            embed
                .setColor(0x009900)
                .setDescription(`Banned ${member.user.username}#${member.user.discriminator} (${member.displayName})`)
            message.channel.send({ embed })
            return ban
        } catch (err) {
            embed
                .setColor(0x990000)
                .setDescription(`Failed to ban ${member.user.username}#${member.user.discriminator} (${member.displayName})`)
            message.channel.send({ embed })
        }

    })
    await Promise.all(completeBan)
}

const info = 'Ban one or more users.'
const usage = 'm!ban *{one or more user tags.} {reason}*'

module.exports = { run, info, usage }