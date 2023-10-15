const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignTask = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'grupos'
    },
    appointed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    done: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    due: {
        type: String
    },
    timestamp: { type: Date, default: Date.now }
})

var AssignTasks = mongoose.model("assignTask", AssignTask);
module.exports = AssignTasks;