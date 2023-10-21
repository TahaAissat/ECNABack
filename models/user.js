const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username : String,
    password : String,
    token : String,
    entreprises : [{type:mongoose.Schema.ObjectId, ref:'entreprises'}]
})

const User = mongoose.model('user', userSchema)

module.exports = User