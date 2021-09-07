const axios = require('axios');
const { token } = require("../config.json");

module.exports = async (message) => {
    const { channel } = message;

    try {
        await axios.post(`https://discord.com/api/v8/channels/${channel.id}/messages/${message.id}/crosspost`,
            {
                headers: {
                    'Authorization': `Bot ${token}`,
                },
            }
        );
    } catch {}
};
