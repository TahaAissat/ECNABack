var express = require('express');
var router = express.Router();
const Intervention = require('../models/intervention')
const Vehicule = require('../models/vehicule')
const {checkBody} = require('../modules/checkBody')

router.post('/addIntervention', (req,res) => {
    if(!checkBody(req.body,['']))
})



module.exports = router;