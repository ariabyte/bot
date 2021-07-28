const
	String = require('./Stringificator.js'),
	logger = require('./Logger.js'),
	bot = require('../index.js'),
	config = require('../log.json');

class UtilFunctions {
	constructor() {
		throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
	}


	static debugLog(channel, reason, count) {
		if (!config.log.loggingLevel == 'debug') return;

		const { guild } = channel;
		let entry = '';

		const logAssets = {
			'server': `Server: ${String.guild(guild)}, owner: ${channel.guild.ownerID}`,
			'channel': `Channel: ${String.channel(channel)}`,
		};

		const addAsset = (...assets) => assets.forEach(asset => entry += `\n${logAssets[asset]}`);

		entry += reason === 'rateLimited' ? `${String.channel(channel)} - ${String.guild(guild)} is being rate limited!${count ? ` (${10 + count}/${config.spam.messagesHourlyLimit})` : ''}` : reason;

		if (reason !== 'rateLimited') addAsset('server', 'channel');
		logger.debug(entry);
	}
}

module.exports = UtilFunctions;
