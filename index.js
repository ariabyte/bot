const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const crosspost = require('./helpers/crosspost');

const { token, welcomeId, guildId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

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

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

client.on("message", async (m) => {
    if (m.author.bot) return;

    if (m.channel.type === "GUILD_NEWS") crosspost(m);
    if (m.channel.id === "862672966416072714") {
        m.delete();
        
        const embed = new MessageEmbed()
            .setColor("#ff004e")
            .setTitle("Suggestion: ")
            .setDescription(m.content)
            .setAuthor(m.author.tag, m.author.displayAvatarURL({ dynamic: true }));
        
        let message = await m.channel.send({ embeds: [embed] });
        
        message.react("856573843186647080");
        message.react("856573943091822603");
        let thread = await message.startThread({
            name: "Discussion",
            startMessage: "This thread is for discussing the suggestion " + m.author.toString() + " made."
        });
        await thread.members.add(m.author.id);
    }
});

client.login(token);