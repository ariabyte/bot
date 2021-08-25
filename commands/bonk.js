const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "bonk",
    description: "Bonk",
    guildOnly: true,
    execute: async (message, args, client) => {
        const user = message.mentions.users.first();
        if(!user) return message.reply( new MessageEmbed()
        .setTitle(`${message.author.username} bonks themself`)
        .setColor("RANDOM")
        .setImage("https://img-comment-fun.9cache.com/media/aPYzMmG/aVlE0ZLW_700w_0.jpg"))
        let embed = new MessageEmbed()
        .setTitle(`${message.author.username} bonks ${user.username}`)
        .setColor("RANDOM")
        .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTGb5CjBZ9vLgJP8ivCe3XWrbW3BmTtODdZITVVP5irSPZW_GhEbtBrbQidxOb-9JX_hg&usqp=CAU")
        message.reply(embed)
    }
}