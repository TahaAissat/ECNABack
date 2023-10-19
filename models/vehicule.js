const mongoose = require('mongoose')

const vehiculesSchema = mongoose.Schema({
    plaque : String,
    type : String,
    interventions : { type : mongoose.Schema.ObjectId, ref : 'interventions'},
    enLigne : Boolean,
    enIntervention : Boolean,
    horsLigne : Boolean,
    indisponible : Boolean
})

const Vehicule = mongoose.model('vehicules' , vehiculesSchema)

module.exports = Vehicule