const { MessageEmbed, Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");

const instance = axios.create();
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows info about the ariabyte server and projects.'),
    async execute(interaction) {
        await interaction.deferReply();
        
        const cApi = await instance.get("https://api.caards.me/");
        const nRedirect = await instance.get("https://noice.link/discord");
        const nStats = await instance.get("https://noice.link/info/json");
        const cStats = await instance.get("https://api.caards.me/utils/stats");
        const cStatus = await instance.get("https://status.caards.me/api/get");
        const aStats = await instance.get("https://ask.rip/api/info");

        const embed = new MessageEmbed()
            .setTitle("Info")
            .setColor("#ff004e")
            .addField(
                "Caards",
                `• API response time: **${cApi.headers['request-duration'] + "ms"}**
                • Registered users: **${cStats.data.users}**
                • System status: ${(cStatus?.data?.lastUpdate?.allOperational ? "<:online:880128377628024843> **All system operational!**" : "<:offline:880128467688120441> [**Something is not working**](https://status.caards.me)")}\n`,
                true
            ).addField(
                "noice.link",
                `• Redirect time: **${nRedirect.headers['request-duration'] + "ms"}**
                • Registered users: **${nStats.data.users}**
                • Links: **${nStats.data.links}**`,
                true
            ).addField(
                "ask.rip",
                `• Registered users: **${aStats.data.users}**
                • Response time: **${aStats.headers['request-duration']}**`,
                true
            ).addField(
                "Discord server",
                `• Member count: **${interaction.guild.memberCount}**
                • Boost count: **${interaction.guild.premiumSubscriptionCount || "0"}**`,
                true
            );

        interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};
