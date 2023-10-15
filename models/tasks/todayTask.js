const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TodayTask = new Schema({
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
      }
}, {
    timestamps: true
});
var TodayTasks = mongoose.model('todayTask', TodayTask);
module.exports = TodayTasks;