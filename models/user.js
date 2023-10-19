const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : String,
    password : String,
    entreprises : {type:mongoose.Schema.ObjectId, ref:'entreprises'}
})

const User = mongoose.model('user', userSchema)

module.exports = User