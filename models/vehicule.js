const mongoose = require('mongoose')

const vehiculesSchema = mongoose.Schema({
    plaque : String,
    type : String,
    interventions : [{ type : mongoose.Schema.ObjectId, ref : 'interventions'}],
    etat : String,
    SIREN : String
})

const Vehicule = mongoose.model('vehicules' , vehiculesSchema)

module.exports = Vehicule