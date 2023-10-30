var express = require('express');
var router = express.Router();
const Patient = require('../models/patient')
const {checkBody} = require('../modules/checkBody');


// Route pour vérifier la présence ou non d'un patient dans la DB lors de la création d'une fiche intervention
router.post('/verify', (req,res) => {
    if(!checkBody(req.body,['SSnumber'])){
        res.json({result:false,error:'Champ vide ou manquant'})
        return
    }
    Patient.findOne({SSnumber:req.body.SSnumber , token : req.body.token})
    .then(data => {
        if(data){
            res.json({result:true,patient:data})
        } else {
            res.json({result:false,error:'Aucun patient avec ce numero de SS trouvé'})
        }
    })
})

// Route pour récuperer la liste des interventions selon le nom d'un patient
router.get('/:patient', (req,res)=>{
    Patient.find({lastName: new RegExp(req.params.patient,'i')})
    .populate({
        path : 'interventions',
        populate : {
            path:'vehicule'
        }
    }
        )
    .then(patientInter =>{
            res.json({result:true, data:patientInter})
    })
})


// Route pour récuperer l'ensemble des patients associés à un token (un utilisateur avec X entreprises)
router.get('/all/:token' , (req,res) => {
    Patient.find({token:req.params.token})
    .then(patientsData => {
        if(patientsData.length>0){
            res.json({result:true , patients : patientsData})
        } else {
            res.json({result:false , error : 'Pas de patients associés à ce compte'})
        }
    })
})

// Patient.deleteMany({})
// .then(() => console.log('done'))


module.exports = router;