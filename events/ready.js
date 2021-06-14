module.exports = (client) => {
    client.user.setPresence({ activity: { name: "music 🎧", type: 2 } });
    console.log("Ready!");
};