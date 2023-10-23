const mongoose = require('mongoose')

const entrepriseSchema = mongoose.Schema({
    name : String,
    SIREN : String,
    vehicules : [{type : mongoose.Schema.ObjectId, ref:'vehicules'}]
})

const Entreprise = mongoose.model('entreprises' , entrepriseSchema)

module.exports = Entreprise