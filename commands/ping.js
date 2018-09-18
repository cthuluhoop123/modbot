function run(client, message, arguments) {
    message.reply(`Pong! ${Date.now() - message.createdAt}ms`).catch(() => {})
}

const info = 'Pong!'

module.exports = { run, info }