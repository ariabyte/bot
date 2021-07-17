const Discord = require('discord.js');
const { inspect } = require('util');

module.exports = {
    name: "eval",
    execute: async (message, args, client) => {
        if (message.author.id != "705080774113886238") return;

        let toEval = clean(args.join(" "));
        try {
            if (toEval) {
                let evaluated = inspect(eval(toEval, { depth: 0 }));
                message.channel.send({
                    embed: {
                        color: 3066993,
                        title: "Evaluation Executed!",
                        description: `\`\`\`${evaluated}\`\`\``,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        timestamp: new Date(),
                    }
                });
            }
        } catch (error) {
            message.channel.send({
                embed: {
                    color: 15158332,
                    title: "Evaluation Cancelled",
                    description: `\`\`\`${error}\`\`\``,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                    },
                    timestamp: new Date()
                }
            });
        }
    }
}

function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)).replace("```JS", "").replace("```", "");
    else
        return text;
}