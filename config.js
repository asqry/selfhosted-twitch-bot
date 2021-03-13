require('dotenv/config');

module.exports = {
  clientOptions: {
    options: {
      debug: true,
    },
    connection: {
      cluster: 'aws',
      reconnect: true,
    },
    identity: {
      username: process.env.USERNAME,
      password: process.env.OAUTH_TOKEN,
    },
    channels: [process.env.ACTIVE_CHANNEL],
  },
};
