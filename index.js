require("dotenv").config();
const { Client, Collection, DiscordAPIError, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const disbut = require("discord-buttons");
const fs = require("fs");
const {
    Manager
} = require("erela.js");
const Spotify = require("erela.js-spotify");
const client = new Discord.Client();
disbut(client);
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
client.commands = new Discord.Collection();

client.manager = new Manager({
        plugins: [

            new Spotify({
                clientID,
                clientSecret
            })
        ],
        nodes: [{
            host: process.env.LV_Host,
            port: 2333,
            password: process.env.LV_pw,
            retryDelay: 5000,
        }],
        autoPlay: true,
        send: (id, payload) => {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    })
    .on("nodeConnect", node => console.log(`Node "${node.options.identifier}" has connected.`))
    .on("nodeError", (node, error) => console.log(
        `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(` | NOW PLAYING`, client.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(`[${track.title}](${track.uri})`)
            .addField(`Requested By : `, `${track.requester}`, true)

        channel.send(embed);
    })
    .on("trackStuck", (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`Track Stuck:`, client.user.displayAvatarURL({
                dynamic: true
            }))
            .setDescription(`${track.title}`)

        channel.send(embed);
    })
    .on("queueEnd", player => {
        const channel = client.channels.cache.get(player.textChannel);
        const embed2 = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`Queue has ended`, client.user.displayAvatarURL({
                dynamic: true
            }))

        channel.send(embed2);
        player.destroy();
    });

client.on("raw", d => client.manager.updateVoiceState(d));

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