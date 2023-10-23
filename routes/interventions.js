var express = require('express');
var router = express.Router();
const Intervention = require('../models/intervention')
const Vehicule = require('../models/vehicule')
const Patient = require('../models/patient')
const {checkBody} = require('../modules/checkBody')


// Route de création d'une intervention (testé)
router.post('/add', (req,res) => {
// Verification des champs départ et arrivée
    if(!checkBody(req.body,['departure','arrival'])){
        res.json({result:false,error:'Missing or empty fields'})
        return
    }
// Si l'Etat du front indique que le patient n'existe pas dans la BDD, créer un nouveau document avec les informations rentrées
    if(!req.body.existe){
        const newPatient = new Patient({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            adress : req.body.adress,
            SSnumber: req.body.SSnumber,
            phone : req.body.phone,
            valide : req.body.valide,
            mutuelle : req.body.mutuelle
        })
    newPatient.save().then(patientData => {
        Vehicule.findOne({plaque:req.body.plaque})
        .then(vehiculeData => {
            const newIntervention = new Intervention({
                patient : patientData._id,
                vehicule:vehiculeData._id,
                departure : req.body.departure,
                arrival : req.body.arrival,
                date : new Date()
            })
        newIntervention.save().then((interventionData) => {
            Vehicule.updateOne({plaque:req.body.plaque},{$push:{interventions:interventionData._id}})
            .then(() => {
                res.json({result:true,message:'Intervention and patient have been added to database'})
            })   
        })
        })
    })
// Si le patient est présent dans la BDD, on recupère l'id et on l'associe directement à l'intervention
    }else {
        Patient.findOne({numeroSS:req.body.numeroSS})
        .then(patientData => {
            Vehicule.findOne({plaque:req.body.plaque})
            .then(vehiculeData => {
                const newIntervention = new Intervention({
                    patient : patientData._id,
                    vehicule:vehiculeData._id,
                    departure : req.body.departure,
                    arrival : req.body.arrival,
                    date : new Date()
                })
            newIntervention.save().then((interventionData) => {
                Vehicule.updateOne({plaque:req.body.plaque},{$push:{interventions:interventionData._id}})
                .then(() => {
                    res.json({result:true,message : 'Intervention added to database'})
                })
            })  
            })
        })
    }
})




module.exports = router;