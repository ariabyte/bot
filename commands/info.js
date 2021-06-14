const { MessageButton, MessageActionRow } = require("discord-buttons");
const Discord = require("discord.js");
const axios = require("axios");
const os = require('os');

const MessageEmbed = Discord.MessageEmbed;

let website = new MessageButton()
    .setLabel("Website info")
    .setStyle("grey")
    .setEmoji("852870554506756126")
    .setID("website-info");

let server = new MessageButton()
    .setLabel("Server info")
    .setStyle("grey")
    .setEmoji("852870550913417227")
    .setID("server-info");

let bot = new MessageButton()
    .setLabel("Bot info")
    .setStyle("grey")
    .setEmoji("852870558231560192")
    .setID("bot-info");

let buttonRow = new MessageActionRow()
    .addComponent(website)
    .addComponent(server)
    .addComponent(bot);

const instance = axios.create();

const loading = new MessageEmbed()
    .setTitle("Caards Info")
    .setColor("#90a7c4")
    .setDescription("<a:loading:853982015161630721> Loading... Please wait.")

instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = process.hrtime()
    return config
});

instance.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    return response
});

let embed;

module.exports = {
    name: "info",
    description: "Returns info about the website, server and bot.",
    guildOnly: false,
    execute: async (message, args, client) => {
        embed = new MessageEmbed()
            .setTitle("Caards Info")
            .setColor("#90a7c4")
            .setDescription("Click one of the buttons below to view info about the selected category.");
        
        const m = await message.channel.send({ component: buttonRow, embed: embed });

        const filter = (button) => button.clicker.user.id === message.author.id;
        const collector = m.createButtonCollector(filter, { time: 30000 });

        collector.on('collect', async b => {
            m.edit({embed: loading});
            if (b.id == "website-info") websiteInfo(m);
            if (b.id == "server-info") serverInfo(m, client);
            if (b.id == "bot-info") botInfo(m, client);
            await b.defer();
        });

        collector.on('end', collected => {
            m.edit({ embed: embed });
        });
    }
}

const websiteInfo = async (m) => {
    const api = await instance.get("https://api.caards.me/user/get/marco");
    const website = await instance.get("https://www.caards.me/");
    const beta = await instance.get("https://beta.caards.me/");
    
    embed = new MessageEmbed()
        .setTitle("Website Info")
        .setColor("#90a7c4")
        .addField("API response time", "```" + api.headers['request-duration'] + "ms ```", true)
        .addField("Website response time", "```" + website.headers['request-duration'] + "ms ```", true)
        .addField("Beta Website response time", "```" + beta.headers['request-duration'] + "ms ```", true);
    
    m.edit({ component: buttonRow, embed: embed });
};

const serverInfo = async (m) => {
    const members = m.guild.members.cache;
    const channels = m.guild.channels.cache;
    const emojis = m.guild.emojis.cache;

    embed = new MessageEmbed()
        .setTitle("Server Info")
        .setColor("#90a7c4")
        .addField("Emoji Count", "```" + emojis.size + "```", true)
        .addField("Regular Emoji Count", "```" + emojis.filter(emoji => !emoji.animated).size + "```", true)
        .addField("Animated Emoji Count", "```" + emojis.filter(emoji => emoji.animated).size + "```", true)
        .addField("Member Count", "```" + m.guild.memberCount + "```", true)
        .addField("Text Channels", "```" + channels.filter(channel => channel.type === 'text').size + "```", true)
        .addField("Voice Channels", "```" + channels.filter(channel => channel.type === 'voice').size + "```", true)
        .addField("Boost Count", "```" + (m.guild.premiumSubscriptionCount || '0') + "```", true);

    m.edit({ component: buttonRow, embed: embed });
};

const botInfo = async (m, client) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    embed = new MessageEmbed()
        .setTitle("Bot Info")
        .setColor("#90a7c4")
        .addField("Version:", "```1.0```", true)
        .addField("Discord.JS version:", "```" + Discord.version + "```", true)
        .addField("Platform:", "```" + os.platform() + "```", true)
        .addField("API latency:", "```" + Math.round(client.ws.ping) + "```", true)
        .addField("Cached users:", "```" + client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) + "```", true)
        .addField("Uptime:", "```" + `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds` + "```", true)

    m.edit({ component: buttonRow, embed: embed });
};