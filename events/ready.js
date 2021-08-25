module.exports = (client) => {
    client.manager.init(client.user.id);
    client.user.setPresence({ activity: { name: "music 🎧", type: 2 } });
    console.log("Ready!");
};