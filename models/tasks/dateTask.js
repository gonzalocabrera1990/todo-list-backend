const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var DateTask = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  due: {
    type: String,
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

var DateTasks = mongoose.model("dateTask", DateTask);
module.exports = DateTasks;