const { MessageEmbed } = require("discord.js");
const { Api } = require("decca-api");
const api = new Api(process.env.DECCA_API_KEY)

module.exports = {
    name: "makememe",
    description: "Make a traditional top text bottom text meme",
    guildOnly: true,
    execute: async (message, args, client) => {
        const { member } = message;
        let image;
        if (message.attachments.first()) image = message.attachments.first().proxyURL;
        else image = member.user.displayAvatarURL({dynamic: false, format: 'png'});

        let content = args.join(' ')

        if (!content) return message.channel.send({
            embed: {
                color: 'RED',
                title: 'Error!',
                description: 'Invalid arguments!\n**Example**: `hello|hi`'
            }
        })

        let options = content.split('|')

        if (options.length < 0) return message.channel.send({
            embed: {
                color: 'RED',
                title: 'Error!',
                description: 'Invalid arguments!\n**Example**: `hello|hi`'
            }
        })

        let topTxt = options[0];
        let botTxt = options[1] || "bottom text";

        const makememe = await api.makeMeme(image, topTxt, botTxt, 2);

        const embed = new MessageEmbed()
        .setTitle(`Fresh meme out of the fridge who dat`)
        .setColor("RANDOM")
        .setImage(makememe)
        message.reply(embed)
    }
}