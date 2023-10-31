var express = require('express');
var router = express.Router();
const Intervention = require('../models/intervention')
const Vehicule = require('../models/vehicule')
const Patient = require('../models/patient')
const {checkBody} = require('../modules/checkBody')
const uid2 = require('uid2')


// Route de création d'une intervention
router.post('/add', (req,res) => {
// Verification des champs départ et arrivée
    if(!checkBody(req.body,['departure','arrival'])){
        res.json({result:false,error:'Missing or empty fields'})
        return
    }
let interToken = uid2(32)
// Si l'Etat du front indique que le patient n'existe pas dans la BDD, créer un nouveau document avec les informations rentrées
    if(!req.body.existe){
        const newPatient = new Patient({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            adress : req.body.adress,
            SSnumber: req.body.SSnumber,
            phone : req.body.phone,
            valide : req.body.valide,
            mutuelle : req.body.mutuelle,
            token : req.body.token
        })
    newPatient.save().then(patientData => {        
            const newIntervention = new Intervention({
                patient : patientData._id,
                departure : req.body.departure,
                arrival : req.body.arrival,
                date : new Date(),
                vehicule : null,
                interToken : interToken,
                SIREN : req.body.SIREN,
                etat : "prévue"
            })
        newIntervention.save().then((interventionData) => {
            Patient.updateOne({SSnumber:req.body.SSnumber},{$push:{interventions:interventionData._id}})
            .then(() => {
                res.json({result:true,message:'Intervention and patient have been added to database'})
            })
        })
    })
// Si le patient est présent dans la BDD, on recupère l'id et on l'associe directement à l'intervention
    }else {
        Patient.findOne({SSnumber:req.body.SSnumber , token : req.body.token})
        .then(patientData => {
                const newIntervention = new Intervention({
                    patient : patientData._id,
                    departure : req.body.departure,
                    arrival : req.body.arrival,
                    date : new Date(),
                    vehicule : null,
                    interToken : interToken,
                    SIREN : req.body.SIREN,
                    etat : 'prévue'
                })
            newIntervention.save().then((interventionData) => {
                Patient.updateOne({SSnumber:req.body.SSnumber},{$push:{interventions:interventionData._id}})
                .then(() => {
                    res.json({result:true,message : 'Intervention added to database and associated to patient document'})
                })
            })  
        })
    }
})

// Route pour récuperer l'ensemble des interventions associées au SIREN connecté
router.get('/:SIREN', (req,res) => {
    Intervention.find({SIREN:req.params.SIREN})
    .populate('patient')
    .populate('vehicule')
    .then(interData => {
        if(interData.length>0){
            res.json({result:true,interventions:interData})
        } else {
            res.json({result:false,interventions:interData})
        }
    })
})

// Route pour dispatcher une intervention à un véhicule
router.post('/dispatch' , (req,res) => {
    Vehicule.findOne({plaque:req.body.plaque})
    .then(vehiculeData => {
        Intervention.findOneAndUpdate({interToken : req.body.interToken} , {vehicule : vehiculeData._id})
        .then((interData) => {
            Vehicule.updateOne({plaque:req.body.plaque} , {$push:{interventions:interData._id}})
            .then(data=>{
                if(data.modifiedCount > 0){
                    res.json({result:true,message:'Intervention dispatchée au vehicule'})
                }
            })
        })
    })
})

// Route pour passer l'etat d'une intervention à 'en cours'
router.post('/start' , (req,res) => {
    Intervention.findOneAndUpdate({interToken:req.body.interToken} , {etat : 'en cours'})
    .populate('vehicule')
    .then(data => {
        Vehicule.findOneAndUpdate({plaque:data.vehicule.plaque} , {etat:'En cours d\'intervention'})
        .then(() => {
            res.json({result:true,data})
        })
    })
})

// Route pour passer l'etat d'une intervention d'en cours à finie
router.post('/end' , (req,res) => {
    Intervention.findOneAndUpdate({interToken:req.body.interToken} , {etat:'finie'})
    .populate('vehicule')
    .then(data => {
        Vehicule.findOneAndUpdate({plaque : data.vehicule.plaque} , {etat:'En ligne'})
        .then(() => {
            res.json({result:true,data})
        })
    })
})


// Intervention.deleteMany({})
// .then(() => console.log('done'))

module.exports = router;