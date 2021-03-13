module.exports = {
  name: 'ping',
  aliases: ['latency'],
  category: 'Utility',
  modonly: true,
  execute: async (client, channel, user, message, args) => {
    client.ping().then((data) => {
      client.say(channel, `Latency: ${data * 1000}ms`);
    });
  },
};
