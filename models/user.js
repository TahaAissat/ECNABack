const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : String,
    password : String,
    entreprises : []
})

const User = mongoose.model('user', userSchema)

module.exports = User