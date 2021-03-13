const { model, Schema } = require('mongoose');

const data = new Schema({
  channel: String,
  command: String,
  response: String,
  userlevel: String,
  count: { type: Number, default: 1 },
});

module.exports = new model('command', data);
