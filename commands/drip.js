const { MessageEmbed } = require("discord.js");
const { Api } = require("decca-api");
const api = new Api(process.env.DECCA_API_KEY)

module.exports = {
    name: "drip",
    description: "Drip",
    guildOnly: true,
    execute: async (message, args, client) => {
        const userArray = message.content.split(" ");
        const userArgs = userArray.slice(1);
        const member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;
        let image;
        if (message.attachments.first()) image = message.attachments.first().proxyURL;
        else image = member.user.displayAvatarURL({dynamic: false, format: 'png'});
        const drip = await api.drip(image);
        const embed = new MessageEmbed()
        .setTitle(`Drippin'`)
        .setColor("RANDOM")
        .setImage(drip)
        message.reply(embed)
    }
}