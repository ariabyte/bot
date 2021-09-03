const { MessageEmbed } = require("discord.js");
const { Api } = require("decca-api");
const api = new Api(process.env.DECCA_API_KEY)

module.exports = {
    name: "mock",
    description: "Mock some text",
    guildOnly: true,
    execute: async (message, args, client) => {
        const mock = await api.mock(message.content);
        message.reply(mock);
    }
}