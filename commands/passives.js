const fs = require('fs')
const { join } = require('path')

const Discord = require('discord.js')

function run(client, message, arguments) {

    const embed = new Discord.RichEmbed()
    if (arguments.length === 0) {
        fs.readdir(join(__dirname, '../passives'), (err, files) => {
            const embed = (new Discord.RichEmbed()).setFooter('modbot').setTimestamp()
            if (err) {
                embed
                    .setColor(0x990000)
                    .setDescription('Sorry! An error has occured.')
                message.reply({ embed }).catch(() => {})
                return
            }

            let infoBody = 'Use **m!passive *{passive name} {on | off}*** to turn passive on or off.\n\n'

            for (let passive of files) {
                let { info } = require(join(__dirname, `../passives/${passive}`))
                infoBody += `**${passive.substring(0, passive.length - 3)}**: ${info}\n`
            }

            embed
                .setColor(0x00AE86)
                .setDescription(infoBody)
            message.reply({ embed }).catch(() => {})
            
        })
    } else {
        const availablePassives = fs.readdirSync(join(__dirname, '../passives')).map(passive => {
            return passive.substring(0, passive.length - 3)
        })
        if (!availablePassives.includes(arguments[0])) {
            embed
                .setColor(0x990000)
                .setDescription('No passive found.')
            message.reply({ embed }).catch(() => {})
            return
        }

        let { usage } = require(join(__dirname, `../passives/${arguments[0]}.js`))
        if (!usage) {
            embed
                .setColor(0x00AE86)
                .setDescription(`**${arguments[0]}** has no special usage.`)
            message.reply({ embed }).catch(() => {})
        } else {
            embed
                .setColor(0x00AE86)
                .setDescription(usage)
            message.reply({ embed }).catch(() => {})
        }
    }
}

const info = 'Shows a list of passives'

module.exports = { run, info }