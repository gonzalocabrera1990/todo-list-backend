const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Task = new Schema({
  description: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  done: {
    type: Boolean,
    default: false
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("task", Task);
