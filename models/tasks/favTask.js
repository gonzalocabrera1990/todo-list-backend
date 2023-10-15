const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FavTask = new Schema({
    description: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fav: {
        type: Boolean,
        default: true
    },
    done: {
        type: Boolean,
        default: false
      },
}, {
    timestamps: true
});

module.exports = mongoose.model('favTask', FavTask);