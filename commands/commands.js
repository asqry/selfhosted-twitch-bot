require('mongoose');
const commands = require('../models/commands');
const axios = require('axios');

module.exports = {
  name: 'commands',
  aliases: ['cmds'],
  category: 'Utility',
  modonly: true,
  execute: async (client, channel, user, message, args) => {
    const userList = await axios.get(
      'https://api.twitch.tv/helix/search/channels?query=' +
        channel.replace(/\#/gim, ''),
      {
        headers: {
          'Authorization': 'Bearer ' + process.env.TOKEN,
          'client-id': process.env.CLIENT_ID,
        },
      }
    );
    const cmds = await commands.find({
      channel: userList.data.data.find(
        (u) => u.display_name === channel.replace(/\#/gim, '')
      ).id,
    });

    if (!args[0]) {
      return client.say(
        channel,
        `${user.username}, Proper usage: !commands [add/edit/delete] [command] [response] (-l userlevel)`
      );
    } else if (args[0].toLowerCase() === 'add') {
      let command = args[1];
      if (!command)
        return client.say(
          channel,
          `${user.username} -> Please provide a command to add`
        );
      else {
        if (cmds.find((c) => c.command.toLowerCase() === command.toLowerCase()))
          return client.say(
            channel,
            `${user.username} -> That is already an existing command. Edit it with !commands edit`
          );
        let response = args.slice(2).join(' '); //introduce variables here :)
        if (!response)
          return client.say(
            channel,
            `${user.username} -> Please provide a response for your new command "${command}"`
          );
        else {
          let userlevel = null;
          let userlevels = message.split(/\-l/gim);
          if (!userlevels.length > 1 || userlevels.length === 1)
            userlevels = [];
          else response = args.slice(2).join(' ').replace(/\-l/gim, '');
          if (userlevels !== [] && userlevels.length !== 0)
            userlevel =
              userlevels[userlevels.length - 1]
                .toLowerCase()
                .replace(/ +/gim, '') || null;
          else if (!userlevel || userlevel === null) userlevel = 'everyone';
          let validlevels = [
            'mod',
            'moderator',
            'owner',
            'vip',
            'sub',
            'subscriber',
            'everyone',
          ];
          if (!validlevels.includes(userlevel))
            return client.say(
              channel,
              `${
                user.username
              } -> That is not a valid userlevel: ${validlevels.join(', ')}`
            );
          const users = await axios.get(
            'https://api.twitch.tv/helix/search/channels?query=' +
              channel.replace(/\#/gim, ''),
            {
              headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'client-id': process.env.CLIENT_ID,
              },
            }
          );

          let regex = new RegExp(userlevel);

          const data = new commands({
            channel: users.data.data.find(
              (u) => u.display_name === channel.replace(/\#/gim, '')
            ).id,
            command: command,
            response: response.replace(regex, ''),
            userlevel: userlevel,
          });

          data.save().then(() => {
            client.say(
              channel,
              `${user.username} -> Successfully added command "${command}"`
            );
          });
        }
      }
    } else if (args[0].toLowerCase() === 'edit') {
      let command = args[1];
      if (!command)
        return client.say(
          channel,
          `${user.username} -> Please provide a command to edit`
        );
      else {
        console.log(cmds);
        if (
          !cmds.find((c) => c.command.toLowerCase() === command.toLowerCase())
        )
          return client.say(
            channel,
            `${user.username} -> That is not an existing command`
          );
        let response = args.slice(2).join(' '); //introduce variables here :)
        if (!response)
          return client.say(
            channel,
            `${user.username} -> Please provide a valid response`
          );
        else {
          let userlevel = null;
          let userlevels = message.split(/\-l/gim);
          if (!userlevels.length > 1 || userlevels.length === 1)
            userlevels = [];
          else response = args.slice(2).join(' ').replace(/\-l/gim, '');
          if (userlevels !== [] && userlevels.length !== 0)
            userlevel =
              userlevels[userlevels.length - 1]
                .toLowerCase()
                .replace(/ +/gim, '') || null;
          else if (!userlevel || userlevel === null)
            userlevel = cmds.find(
              (c) => c.command.toLowerCase() === command.toLowerCase()
            ).userlevel;
          if (
            user.mod &&
            cmds
              .find((c) => c.command.toLowerCase() === command.toLowerCase())
              .userlevel.toLowerCase() === 'owner'
          )
            return client.say(
              channel,
              `${user.username} -> You cannot edit that command. The userlevel is too high`
            );
          let validlevels = [
            'mod',
            'moderator',
            'owner',
            'vip',
            'sub',
            'subscriber',
            'everyone',
          ];
          if (!validlevels.includes(userlevel))
            return client.say(
              channel,
              `${
                user.username 
              } -> That is not a valid userlevel: ${validlevels.join(', ')}`
            );
          const users = await axios.get(
            'https://api.twitch.tv/helix/search/channels?query=' +
              channel.replace(/\#/gim, ''),
            {
              headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'client-id': process.env.CLIENT_ID,
              },
            }
          );

          let regex = new RegExp(userlevel);

          const data = await commands.findOne({
            channel: users.data.data.find(
              (u) => u.display_name === channel.replace(/\#/gim, '')
            ).id,
            command: command,
          });
          data.response = response.replace(regex, '');
          data.userlevel = userlevel;

          data.save().then(() => {
            client.say(
              channel,
              `${user.username} -> Successfully edited command "${command}"`
            );
          });
        }
      }
    } else if (args[0].toLowerCase() === 'delete') {
      let command = args[1];
      if (!command)
        return client.say(
          channel,
          `${user.username} -> Please provide a command to delete`
        );
      else {
        if (
          !cmds.find((c) => c.command.toLowerCase() === command.toLowerCase())
        )
          return client.say(
            channel,
            `${user.username} -> That is not an existing command`
          );
        else {
          const users = await axios.get(
            'https://api.twitch.tv/helix/search/channels?query=' +
              channel.replace(/\#/gim, ''),
            {
              headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN,
                'client-id': process.env.CLIENT_ID,
              },
            }
          );

          console.log(command);

          const data = await commands.findOne({
            channel: users.data.data.find(
              (u) => u.display_name === channel.replace(/\#/gim, '')
            ).id,
            command: command,
          });
          data.remove().then(() => {
            client.say(
              channel,
              `${user.username} -> Successfully deleted command "${command}"`
            );
          });
        }
      }
    }
  },
};
