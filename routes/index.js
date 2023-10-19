var express = require('express');
var router = express.Router();
const place = require('../models/place')

router.post('/places', function(req, res) {
    place.findOne({nickname: req.body.nickname, name: req.body.name, latitude: req.body.latitude, longitude:req.body.longitude})
    .then(data =>{
        if(data){
            res.json('Profil existant !')
        }
        else{
            const newPlace = new  place({
                nickname: req.body.nickname,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            })
            newPlace.save().then(()=> res.json({result: true, location: newPlace}))
        }
    })
});


router.get('/places/:nickname', function(req,res){
    place.findOne({nickname: req.params.nickname})
    .then(data => {
        if(data){
            res.json({result: true, places:{data}})
        }
        else{
            res.json({result: 'Ville non-trouvée !'})
        }
    })
})

router.delete('/places', function(req, res){
    place.findOne({nickname: req.body.nickname, name: req.body.name})
    .then(data => {
        if(data){
            data.deleteOne().then(()=> res.json)
            res.json({result: true, places:{data}})
        }
    })
})



module.exports = router;