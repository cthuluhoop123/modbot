const fs = require('fs')
const { join } = require('path')

const Discord = require('discord.js')

function run(client, message, arguments) {
    const embed = new Discord.RichEmbed()
    if (arguments.length === 0) {
        fs.readdir(__dirname, (err, files) => {
            const embed = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()
            if (err) {
                embed
                    .setColor(0x990000)
                    .setDescription('Sorry! An error has occured.')
                message.reply({ embed })
                return
            }

            let infoBody = 'Use **m!help *{command}*** for usage information.\nUse **m!passives** to see a list of passive functions.\n\n'

            for (let command of files) {
                let { info } = require(join(__dirname, `/${command}`))
                infoBody += `**${command.substring(0, command.length - 3)}**: ${info}\n`
            }

            embed
                .setColor(0x00AE86)
                .setDescription(infoBody)
            message.reply({ embed })
        })
    } else {
        const availableCommands = fs.readdirSync(join(__dirname)).map(command => {
            return command.substring(0, command.length - 3)
        })
        if (!availableCommands.includes(arguments[0])) {
            embed
                .setColor(0x990000)
                .setDescription('No command found.')
            message.reply({ embed })
            return
        }

        let { usage } = require(join(__dirname, `/${arguments[0]}.js`))
        if (!usage) {
            embed
                .setColor(0x00AE86)
                .setDescription(`**${arguments[0]}** has no special usage.`)
            message.reply({ embed })
        } else {
            embed
                .setColor(0x00AE86)
                .setDescription(usage)
            message.reply({ embed })
        }
    }
}

const info = 'Shows a list of commands'

module.exports = { run, info }