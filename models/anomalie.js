const mongoose = require ('mongoose')

const anomaliesSchema = mongoose.Schema ({
    manqueSS : Boolean,
    manqueMutuelle : Boolean,
    manqueBR : Boolean,
    manqueAP : Boolean,
    intervention : {type : mongoose.Schema.ObjectId, ref:'interventions'}
})

const Anomalie = mongoose.model('anomalies',anomaliesSchema)

module.exports = Anomalie