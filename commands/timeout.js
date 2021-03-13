const axios = require('axios');
require('dotenv/config');
const ms = require('ms');

module.exports = {
  name: 'timeout',
  aliases: ['mute'],
  category: 'Moderation',
  modonly: true,
  execute: async (client, channel, user, message, args) => {
    let target = args[0];
    if (!target)
      return client.say(
        channel,
        `${user.username} -> Please provide a user to time out`
      );
    axios
      .get(
        'https://api.twitch.tv/helix/search/channels?query=' +
          args[0].toLowerCase().replace(/\@/gim, ''),
        {
          headers: {
            'Authorization': 'Bearer ' + process.env.TOKEN,
            'client-id': process.env.CLIENT_ID,
          },
        }
      )
      .then((data) => {
        target = data.data.data[0].display_name;
      });
    let time = ms(args[1]) / 1000;
    if (!time) time = 600;
    let reason = args.slice(2).join(' ').replace(time, '');
    if (!reason) reason = 'No reason was specified.';

    client
      .timeout(channel, target, time, reason)
      .then((data) => {})
      .catch((err) => {
        return client.say(
          channel,
          `${user.username} -> An error occurred: ${err}`
        );
      });
  },
};
