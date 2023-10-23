var express = require('express');
var router = express.Router();
const Patient = require('../models/patient')
const {checkBody} = require('../modules/checkBody')

// Route pour vérifier la présence ou non d'un patient dans la DB lors de la création d'une fiche intervention
router.post('/verify', (req,res) => {
    if(!checkBody(req.body,['SSnumber'])){
        res.json({result:false,error:'Champ vide ou manquant'})
        return
    }
    Patient.findOne({SSnumber:req.body.SSnumber})
    .then(data => {
        if(data){
            res.json({result:true,patient:data})
        } else {
            res.json({result:false,error:'Aucun patient avec ce numero de SS trouvé'})
        }
    })
})

// Route pour récuperer l'ensemble des patients
router.get('/all', (req,res) => {
    Patient.find().then(patientData => {
        res.json({result:true,patientData})
    })
})




module.exports = router;