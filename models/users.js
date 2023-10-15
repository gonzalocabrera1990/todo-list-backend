const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
const path = require("path");


const Image = new Schema(
  {
    filename: {
      type: String,
      default: 'images/perfildefault.jpg'
    },
    timestamp: { type: Date, default: Date.now }
  }
);
const Colors = new Schema(
  {
    home: {
      type: String,
      default: '#5f73c2'
    },
    importants: {
      type: String,
      default: '#5f73c2'
    },
    whitdate: {
      type: String,
      default: '#5f73c2'
    },
    mytasks: {
      type: String,
      default: '#5f73c2'
    },
    alltasks: {
      type: String,
      default: '#5f73c2'
    },
    groupcreator: {
      type: String,
      default: '#5f73c2'
    },
    listcreator: {
      type: String,
      default: '#5f73c2'
    },
    searchView: {
      type: String,
      default: '#5f73c2'
    },
    timestamp: { type: Date, default: Date.now }
  }
);
const Colores = mongoose.model('Colors', Colors);
const Notification = new Schema({
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Notification creator
  message: {
    type: String
  }, // any description of the notification message 
  readstatus: {
    type: Boolean,
    default: false
  },
  timestamp: { type: Date, default: Date.now }

})

const User = new Schema(
  {
    firstname: {
      type: String,
      default: ""
    },
    lastname: {
      type: String,
      default: ""
    },
    image: Image,
    country: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      default: ""
    },
    admin: {
      type: Boolean,
      default: false
    },
    usuario: {
      type: String,
      default: ""
    },
    
    backgrounds: Colors,
    notifications: [Notification],

    
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }],
    todaytasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }],
    favTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'favTask'
    }],
    datetasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dateTask'
    }],
    lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'listas'
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'grupos'
    }],
    assigntasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'assignTask'
    }]
  },
  {
    timestamp: { type: Date, default: Date.now }
  }
);

User.plugin(passportLocalMongoose);
// ImageStart.virtual('commento', {
//   ref: 'Comment',
//   localField: 'comments',
//   foreignField: 'image'
// })
// ImageStart.set('toObject', { virtuals: true })
// ImageStart.set('toJSON', { virtuals: true })
module.exports = mongoose.model("User", User);
