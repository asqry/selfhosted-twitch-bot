require('dotenv/config');
const tmi = require('tmi.js');
const fs = require('fs');

const commandModel = require('./models/commands');
const mongoose = require('mongoose');
const { vars } = require('./variables');
const axios = require('axios');
mongoose.connect(process.env.MONGO_CONNECTION_URI, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const data = {
  options: {
    debug: true,
  },
  connection: {
    cluster: 'aws',
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.ACTIVE_CHANNEL],
};

const client = new tmi.Client(data);

client.connect();

client.on('connected', async (address, port) => {
  client.color(process.env.COLOR);
  client.say(process.env.ACTIVE_CHANNEL, 'Connected!');
});

const commands = [];
const aliases = [];

let files = fs.readdirSync('./commands/');
for (const file of files) {
  const cmd = require('./commands/' + file);
  let genRand = Math.floor(100000 + Math.random() * 900000).toString();
  commands.push({
    name: cmd.name ? cmd.name : `Undefined-${genRand}`,
    aliases: cmd.aliases ? cmd.aliases : [],
    category: cmd.category ? cmd.category : 'Undefined',
    modonly: cmd.modonly ? cmd.modonly : false,
    execute: cmd.execute ? cmd.execute : null,
  });

  if (cmd.aliases && cmd.aliases.length !== 0)
    aliases.push({
      name: cmd.name ? cmd.name : `Undefined-${genRand}`,
      aliases: cmd.aliases,
    });
}

mongoose.connection.on('open', () => {
  console.log('Connected to the Database :D');
});

client.on('chat', async (channel, user, message, self) => {
  if (self) return;

  //---
  const findCommand = async (str) => {
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
    const commandList = await commandModel.find({});
    let cmd = commandList.find(
      (c) =>
        c.command.toLowerCase() === str.toLowerCase() &&
        c.channel ===
          users.data.data.find(
            (u) => u.display_name === channel.replace(/\#/gim, '')
          ).id
    );
    console.log(channel.replace(/\#/, ''));

    if (!cmd) return;
    let userlevel = cmd.userlevel == null ? 'everyone' : cmd.userlevel;

    let countRegex = new RegExp(vars.count, 'gmi');
    let userRegex = new RegExp(vars.userVar, 'gmi');

    console.log(countRegex);

    let addCount = cmd.response.replace(countRegex, cmd.count);
    let addUser = addCount.replace(userRegex, user.username);

    let res = addUser;

    cmd.count = cmd.count + 1;
    cmd.save();

    if (
      user['badges-raw'] &&
      user['badges-raw'].toLowerCase().includes('broadcaster')
    )
      return client.say(channel, res);
    if (userlevel !== 'owner' && user.mod) return client.say(channel, res);

    if (userlevel === 'everyone') {
      client.say(channel, res);
    } else if (useerlvel === 'mod' || userlevel === 'moderator') {
      if (user.mod) {
        return client.say(channel, res);
      } else if (
        user['badges-raw'] &&
        user['badges-raw'].includes('broadcaster')
      ) {
        return client.say(channel, res);
      } else if (!user.mod) {
        return;
      } else if (
        !user['badges-raw'] ||
        !user['badges-raw'].includes('broadcaster')
      ) {
        return;
      }
    } else if (userlevel === 'vip') {
      if (
        !user['badges-raw'] ||
        !user['badges-raw'].toLowerCase().includes('vip')
      ) {
        return;
      } else {
        return client.say(channel, res);
      }
    } else if (userlevel === 'sub' || 'subscriber') {
      if (
        !user['badges-raw'] ||
        !user['badges-raw'].toLowerCase().includes('sub')
      ) {
        return;
      } else {
        return client.say(channel, res);
      }
    }
  };

  findCommand(message);
  //---

  const prefix = '!';
  const args = message.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  commands.forEach((cmd) => {
    if (command === cmd.name || cmd.aliases.includes(command)) {
      if (cmd.modonly) {
        if (user.mod) {
          console.log(
            `Command was run in ${channel} by ${user.username} (${message})`
          );
          return cmd.execute(client, channel, user, message, args);
        } else if (
          user['badges-raw'] &&
          user['badges-raw'].includes('broadcaster')
        ) {
          console.log(
            `Command was run in ${channel} by ${user.username} (${message})`
          );
          return cmd.execute(client, channel, user, message, args);
        } else if (!user.mod) {
          return client.say(channel, `Only mods can use that command!`);
        } else if (
          !user['badges-raw'] ||
          !user['badges-raw'].includes('broadcaster')
        ) {
          return client.say(channel, `Only mods can use that command!`);
        } else {
          console.log(
            `Command was run in ${channel} by ${user.username} (${message})`
          );
          return cmd.execute(client, channel, user, message, args);
        }
      } else {
        console.log(
          `Command was run in ${channel} by ${user.username} (${message})`
        );
        cmd.execute(client, channel, user, message, args);
      }
    }
  });
});
