function run(client, message, arguments) {
    message.reply(`Pong! ${Date.now() - message.createdAt}ms`)
}

const info = 'Pong!'

module.exports = { run, info }