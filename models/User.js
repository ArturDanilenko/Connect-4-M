const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    register_date:{
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);