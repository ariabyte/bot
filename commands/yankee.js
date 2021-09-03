const { MessageEmbed } = require("discord.js");
const { Api } = require("decca-api");
const api = new Api(process.env.DECCA_API_KEY)

module.exports = {
    name: "yankee",
    description: "Yankee with brim",
    guildOnly: true,
    execute: async (message, args, client) => {
        const userArray = message.content.split(" ");
        const userArgs = userArray.slice(1);
        const member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;
        let image;
        if (message.attachments.first()) image = message.attachments.first().proxyURL;
        else image = member.user.displayAvatarURL({dynamic: false, format: 'png'});
        const yankee = await api.yankee(image);
        const embed = new MessageEmbed()
        .setTitle(`WOAH YANKEE WITH BRIM!!!!`)
        .setColor("RANDOM")
        .setImage(yankee)
        message.reply(embed)
    }
}