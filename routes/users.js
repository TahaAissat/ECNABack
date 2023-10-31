var express = require('express');
var router = express.Router();
const {checkBody} = require('../modules/checkBody')
const User = require('../models/user')
const Entreprise = require('../models/entreprise')
const uid2 = require('uid2')
const bcrypt = require('bcrypt')


// Route SignUp (testé)
router.post('/signup', (req,res) => {
// Verification des champs renvoyés du front avec le module checkBody
    if(!checkBody(req.body,['username','password','email', 'name' , 'SIREN'])){
        res.json({result:false , error: 'Champs vides ou manquants'})
        return
    }
// Cryptage mdp 
let hash = bcrypt.hashSync(req.body.password,10)
// Generation token
let token = uid2(32)
// Check si user existe déja dans la BDD
User.findOne({username:req.body.username})
.then(data => {
    if(data === null){
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hash,
            token : token,
            entreprises : []
        })
    newUser.save().then(() => {
Entreprise.findOne({SIREN:req.body.SIREN})
.then(data => {
    if(data === null){
        const newEntreprise = new Entreprise({
            name : req.body.name,
            SIREN : req.body.SIREN,
            vehicules : []
        })
    newEntreprise.save()
    .then((data) => {
// On met à jour le document user dont le token correspond au token renvoyé du front(présent dans le reducer)   
      User.updateOne({token:token},{$push:{entreprises:data._id}})
        .then(() => {
            res.json({result:true,token:token,SIREN : req.body.SIREN,message : 'Entreprise created & added to user document'})
                })
            })
    } else {
        res.json({result:false})
    }
})
})
} else {
    res.json({result:false})
}
})
})


// Route signIn (testé)
router.post('/signin', (req,res) => {
// Verification des champs renvoyés du front avec le module checkBody
    if(!checkBody(req.body,['username' , 'password'])){
        res.json({result:false , error: 'Un ou plusieurs champs sont vides'})
        return
    }
User.findOne({username : req.body.username})
.populate('entreprises')
.then(data => {
// Si le nom ainsi que le mot de passe correspondent, on renvoit true et le token
    if(data && bcrypt.compareSync(req.body.password,data.password)) {
        res.json({result:true , token : data.token , SIREN : data.entreprises[0].SIREN})
    } else {
// Si non, renvoyer false et message d'erreur
        res.json({result:false,error:'Mauvais identifiant ou mot de passe'})
    }
})
})

// // Création du document entreprise lorsqu'un user sign up (testé)
// router.post('/addEntreprise', (req,res) => {
// // Verification des champs
//     if(!checkBody(req.body,['name','SIREN'])){
//         res.json({result:false, error : 'Empty or missing fields'})
//     }
// // Recherche dans la collection entreprises d'un document avec le SIREN envoyé du front
// Entreprise.findOne({SIREN:req.body.SIREN})
// .then(data => {
//     if(data === null){
//         const newEntreprise = new Entreprise({
//             name : req.body.name,
//             SIREN : req.body.SIREN,
//             vehicules : []
//         })
//     newEntreprise.save().then((data) => {
// // On met à jour le document user dont le token correspond au token renvoyé du front(présent dans le reducer)   
//         User.updateOne({token:req.body.token},{$push:{entreprises:data._id}})
//         .then(() => {
//             res.json({result:true, SIREN : req.body.SIREN, message : 'Entreprise created & added to user document'})
//         })
//     })
//     } else {
//         res.json({result:false, error:'Une entreprise avec ce SIREN existe dejà'})
//     }
// })    
// })

// User.deleteMany({})
// .then(() => console.log('done'))


module.exports = router;
 