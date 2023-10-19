const mongoose = require('mongoose')

const entrepriseSchema = mongoose.Schema({
    name : String,
    SIREN : Number,
    vehicules : {type : mongoose.Schema.ObjectId, ref:'vehicules'}
})

const Entreprise = mongoose.model('entreprises' , entrepriseSchema)

module.exports = Entreprise