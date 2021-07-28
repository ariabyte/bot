const fetch = require('node-fetch');

module.exports = async (message) => {
	const { channel } = message;

	await fetch(
		`https://discord.com/api/v8/channels/${channel.id}/messages/${message.id}/crosspost`,
		{
			method: 'POST',
			headers: {
				'Authorization': `Bot ${process.env.TOKEN}`,
			},
		},
	)
		.then(res => res.json())
		.then(json => {
			if (json.retry_after) {
				setTimeout(() => {
					crosspost(message);
				}, json.retry_after * 1000);
			}
		});
};
