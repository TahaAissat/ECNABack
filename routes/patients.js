var express = require('express');
var router = express.Router();
const Patient = require('../models/patient')
const {checkBody} = require('../modules/checkBody')

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



module.exports = router;