var express = require('express');
var router = express.Router();
const Vehicule = require('../models/vehicule');
const Entreprise = require('../models/entreprise')
const {checkBody} = require('../modules/checkBody')


// Route création de véhicule et association à l'entreprise (testé)
router.post('/add' , (req,res) => {
// Verification des champs envoyés du front
    if(!checkBody(req.body,['plaque','type'])){
        res.json({result:false, error:'Empty or missing fields'})
    }
// Verification si un vehicule avec la meme plaque existe en DB
    Vehicule.findOne({plaque:req.body.plaque})
    .then(data => {
// Si non, création du document
        if(data === null){
            const newVehicule = new Vehicule({
                plaque : req.body.plaque,
                type : req.body.type,
                etat : req.body.etat,
                SIREN : req.body.SIREN,
                interventions : []
            })
        newVehicule.save().then((data) => {
// Après la création du document dans la collection vehicules, on l'associe à l'entreprise avec le SIREN qu'on recupère du reducer 
            Entreprise.updateOne({SIREN:req.body.SIREN},{$push:{vehicules:data._id}})
            .then(() => {
                res.json({result:true, message:'Vehicule created and added to entreprise document'})
            })
        })
        } else {
            res.json({result:false,error:'Un véhicule avec cette plaque a deja été enregistré'})
        }
    })
})

// Route pour renvoyer la liste de tous les véhicules associés au SIREN présent dans le reducer (testé)
router.get('/:SIREN', (req,res) => {
    Vehicule.find({SIREN:req.params.SIREN})
    .then(data => {
        res.json({result:true,vehicules:data})
    })
})

// Route pour récuperer les interventions associées à un véhicule
router.get('/interventions/:plaque', (req,res) => {
    Vehicule.findOne({plaque:req.params.plaque})
    .populate({
        path : 'interventions',
        populate : {
            path:'patient'
        }
    }
        )
    .then(data => {
        res.json({result:true,interventions:data.interventions})
    })
})

router.post('/update/:plaque', (req,res)=>{
    Vehicule.findOneAndUpdate({plaque:req.params.plaque, etat: req.body.etat})
    .then(data=>{
       res.json({result:true, Vehicule: data})
    })
})


module.exports = router;