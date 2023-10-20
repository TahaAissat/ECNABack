const mongoose = require('mongoose')

const interventionsSchema = mongoose.Schema({
    patient : {type:mongoose.Schema.ObjectId,ref:'patients'},
    vehicule : {type:mongoose.Schema.ObjectId,ref:'vehicules'},
    phone : Number,
    depart : String,
    arrival : String,
    date : Date,
    anomalie : {type : mongoose.Schema.ObjectId, ref:'anomalies'}
})

const Intervention = mongoose.model('interventions', interventionsSchema)

module.exports = Intervention