const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assignTask'
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
        timestamp: { type: Date, default: Date.now }
    })

module.exports = mongoose.model("grupos", Group);