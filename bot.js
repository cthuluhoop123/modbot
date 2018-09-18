require('dotenv').config()

const fs = require('fs')
const { join } = require('path')

const { promisify } = require('util')

const config = require('./config.js')

const redis = require('redis')
const redisClient = redis.createClient()

const lrangeAsync = promisify(redisClient.lrange).bind(redisClient)

const Discord = require('discord.js')
const client = new Discord.Client({
    disabledEvents: ['TYPING_START']
})

const availableCommands = fs.readdirSync(join(__dirname, '/commands')).map(command => {
    return command.substring(0, command.length - 3)
})

client.on('ready', async () => {
    console.log('Ready...')
    console.log(await client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE']))
})

client.on('message', async message => {

    message.content = message.content.toLowerCase()
    if (message.author.bot) { return }
    if (!message.content.startsWith(config.prefix)) {
        try {
            let passives = await lrangeAsync(`passives:${message.guild.id}`, 0, -1)
            if (passives.length > 0) {
                let runPassives = passives.map(async passive => {
                    let sideEffect = require(`./passives/${passive}.js`)
                    return await sideEffect.run(client, message)
                })
                await Promise.all(runPassives)
            }
        } catch (err) {
            console.log(err)
        }
        return
    }

    let arguments = message.content.split(' ')
    let command = arguments.shift()
    command = command.substring(config.prefix.length, command.length)

    if (!availableCommands.includes(command)) { return }

    //might profile for mem leaks
    let intent = require(`./commands/${command}`)
    intent.run(client, message, arguments)
})

client.on('error', err => {
    console.log(err)
})

client.login(process.env.TOKEN)

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason)
})