const mongoose = require('mongoose')

const patientsSchema = mongoose.Schema ({
    name : String,
    adress : String,
    telephone : Number,
    SSnumber : Number,
    mutuelle : String,
    interventions : {type : mongoose.Schema.ObjectId, ref:'interventions'}
})

const Patient = mongoose.model('patients',patientsSchema)

module.exports = Patient