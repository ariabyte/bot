const Discord = require("discord.js");

module.exports = (client, member) => {
    const channel = member.guild.channels.cache.get("858347183228190741");

    if (channel) {
        const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(`Hi <@${member.user.id}>!\nWe're happy you joined! Make sure to read <#845004813082034246> to see what this server is all about!`)
            .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        channel.send({ content: `<@${member.user.id}>`, embed: embed });
    }
};