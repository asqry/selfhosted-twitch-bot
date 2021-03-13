const axios = require('axios');
require('dotenv/config');

module.exports = {
  name: 'ban',
  category: 'Moderation',
  modonly: true,
  execute: async (client, channel, user, message, args) => {
    let target = args[0];
    if (!target)
      return client.say(
        channel,
        `${user.username} -> Please provide a user to ban`
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
        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason was specified.';

        client
          .ban(channel, target, reason)
          .then((data) => {})
          .catch((err) => {
            return client.say(
              channel,
              `${user.username} -> An error occurred: ${err}`
            );
          });
      });
  },
};
