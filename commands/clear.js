module.exports = {
  name: 'clear',
  category: 'Moderation',
  aliases: ['clearchat'],
  modonly: true,
  execute: async (client, channel, user, message, args) => {
    client
      .clear(channel)
      .then((data) => {})
      .catch((err) => {
        return client.say(
          channel,
          `${user.username} -> An error occurred: ${err}`
        );
      });
  },
};
