var express = require('express');
var router = express.Router();
const Vehicule = require('../models/vehicule');
const Entreprise = require('../models/entreprise')
const {checkBody} = require('../modules/checkBody')

router.post('/addVehicule' , (req,res) => {
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
                etat : 'en ligne',
                interventions : []
            })
        newVehicule.save().then((data) => {
// Après la création du document dans la collection vehicules, on l'associe à l'entreprise avec le SIREN qu'on recupère du reducer 
            Entreprise.updateOne({SIREN:req.body.SIREN},{$push:{vehicules:data._id}})
            .then(() => {
                res.json({result:true,message:'Vehicule created and added to entreprise document'})
            })
        })
        } else {
            res.json({result:false,error:'Un véhicule avec cette plaque a deja été enregistré'})
        }
    })
})


module.exports = router;