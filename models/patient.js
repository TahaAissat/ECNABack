const mongoose = require('mongoose')

const patientsSchema = mongoose.Schema ({
    lastName : String,
    firstName:String,
    adress : String,
    phone : Number,
    SSnumber : Number,
    mutuelle : String,
    valide : Boolean,
    interventions : {type : mongoose.Schema.ObjectId, ref:'interventions'}
})

const Patient = mongoose.model('patients',patientsSchema)

module.exports = Patient