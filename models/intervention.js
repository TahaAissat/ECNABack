const mongoose = require('mongoose')

const interventionsSchema = mongoose.Schema({
    patient : {type:mongoose.Schema.ObjectId,ref:'patients'},
    vehicule : {type:mongoose.Schema.ObjectId,ref:'vehicules'},
    departure : String,
    arrival : String,
    date : Date,
    anomalie : {type : mongoose.Schema.ObjectId, ref:'anomalies'},
    SIREN : String,
    interToken : String,
    etat : String
})

const Intervention = mongoose.model('interventions', interventionsSchema)

module.exports = Intervention