const mongoose = require('mongoose')

const patientsSchema = mongoose.Schema ({
    lastName : String,
    firstName:String,
    adress : String,
    phone : String,
    SSnumber : String,
    mutuelle : String,
    valide : String,
    interventions : {type : mongoose.Schema.ObjectId, ref:'interventions'},
    token : String,
})

const Patient = mongoose.model('patients',patientsSchema)

module.exports = Patient