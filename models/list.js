const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListTask = new Schema(
    {
        description: {
            type: String,
            default: ''
        },
        done: {
            type: Boolean,
            default: false
          },
        timestamp: { type: Date, default: Date.now }
    }
);
//para el populate probar creando el ongoose.model en list y group
//mongoose.model('listtask', ListTask);
//o tambien populate con la propiedad path

const List = new Schema({
    name: {
        type: String
    },
    tasks: [ListTask],
    timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('listas', List);