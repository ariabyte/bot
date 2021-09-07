const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const crosspost = require('./helpers/crosspost');

const { token, welcomeId, guildId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
client.cooldowns = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    client.user.setPresence({ activities: [{ name: "code 😎", type: 2 }] });
    console.log('Ready!');
});

client.on("guildMemberAdd", (m) => {
    if (m.guild.id != guildId) return;

    const embed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setDescription(`Hi <@${member.user.id}>!\nWe're happy you joined! Make sure to read <#845004813082034246> to see what this server is all about!`)
        .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    client.channels.cache.get(welcomeId)?.send({ content: `<@${member.user.id}>`, embed: embed });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            //return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

client.on("message", (m) => {
    if (m.channel.type === "GUILD_NEWS") crosspost(m);
});

client.login(token);