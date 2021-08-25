module.exports = {
    name: "volume",
    guildOnly: true,
    description: "Set volume level of the music",
    execute: (message, args) => {
      const player = message.client.manager.get(message.guild.id);
  
      if (!player) return message.reply("there is no player for this guild.");
      if (!args.length) return message.reply(`the player volume is \`${player.volume}\`.`)
  
      const { channel } = message.member.voice;
      
      if (!channel) return message.reply("you need to join a voice channel.");
      if (channel.id !== player.voiceChannel) return message.reply("you're not in the same voice channel.");
  
      const volume = Number(args[0]);
      
      if (!volume || volume < 1 || volume > 100) return message.reply("you need to give me a volume between 1 and 100.");
  
      player.setVolume(volume);
      return message.reply(`set the player volume to \`${volume}\`.`);
    }
  }