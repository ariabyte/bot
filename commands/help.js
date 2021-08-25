const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "Returns this message.",
    guildOnly: false,
    execute: async (message, args, client) => {
        const embed = new MessageEmbed()
            .setColor("#90a7c4")
            .setTitle("Help");
    
        for (const command of client.commands) {
            if (!command[1].noshow) embed.addField(command[1].name, command[1].description, true);
        }

        message.channel.send(embed);
    }
}