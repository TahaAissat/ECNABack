const mongoose = require ('mongoose')

const anomaliesSchema = mongoose.Schema ({
    manqueSS : Boolean,
    manqueMutuelle : Boolean,
    manqueBT : Boolean,
    manqueBS : Boolean,
    intervention : {type : mongoose.Schema.ObjectId, ref:'interventions'}
})

const Anomalie = mongoose.model('anomalies',anomaliesSchema)

module.exports = Anomalie