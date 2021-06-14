require("dotenv").config();

const Discord = require("discord.js");
const disbut = require("discord-buttons");
const fs = require("fs");

const client = new Discord.Client();
disbut(client);

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Command loaded: ${file}`);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(file.replace(".js", ""), event.bind(null, client));
    console.log(`Event loaded: ${file}`);
}

client.login(process.env.TOKEN);