var express = require('express');
var router = express.Router();
const {checkBody} = require('../modules/checkBody')
const User = require('../models/user')
const Entreprise = require('../models/entreprise')
const uid2 = require('uid2')
const bcrypt = require('bcrypt')


// Route SignUp 
router.post('/signup', (req,res) => {
// Verification des champs renvoyés du front avec le module checkBody
    if(!checkBody(req.body,['username' , 'password'])){
        res.json({result:false , error: 'Missing or empty fields'})
        return
    }
// Cryptage mdp 
let hash = bcrypt.hashSync(req.body.password,10)
// Generation token
let token = uid2(32)
// Check si user existe déja dans la BDD
User.findOne({name:req.body.username})
.then(data => {
    if(data === null){
        const newUser = new User({
            username : req.body.username,
            password : hash,
            token : token,
            entreprises : []
        })
    newUser.save().then(() => {
// Si le nom n'est pas présent dans la BDD, on save + renvoie token vers le front        
        res.json({result : true , token})
    })
    } else {
// Si nom présent, renvoyer un message d'erreur 
        res.json({result:false , error : 'This name has been taken'})
    }
})
})

// Route signIn 
router.post('/signin', (req,res) => {
// Verification des champs renvoyés du front avec le module checkBody
    if(!checkBody(req.body,['username' , 'password'])){
        res.json({result:false , error: 'Missing or empty fields'})
        return
    }
User.findOne({username : req.body.username})
.then(data => {
// Si le nom ainsi que le mot de passe correspondent, on renvoit true et le token
    if(data && bcrypt.compareSync(req.body.password,data.password)) {
        res.json({result:true , token : data.token})
    } else {
// Si non, renvoyer false et message d'erreur
        res.json({result:false,error:'User not found'})
    }
})
})

// Création du document entreprise lorsqu'un user sign up
router.post('/addEntreprise', (req,res) => {
// Verification des champs
    if(!checkBody(req.body,['name','SIREN'])){
        res.json({result:false, error : 'Empty or missing fields'})
    }
// Recherche dans la collection entreprises d'un document avec le SIREN envoyé du front
Entreprise.findOne({SIREN:req.body.SIREN})
.then(data => {
    if(data === null){
        const newEntreprise = new Entreprise({
            name : req.body.name,
            SIREN : req.body.SIREN,
            vehicules : []
        })
    newEntreprise.save().then((data) => {
// On met à jour le document user dont le token correspond au token renvoyé du front(présent dans le reducer)   
        User.updateOne({token:req.body.token},{$push:{entreprises:data._id}})
        .then(() => {
            res.json({result:true, message : 'Entreprise created & added to user document'})
        })
    })
    } else {
        res.json({result:false, error:'Une entreprise avec ce SIREN existe dejà'})
    }
})    
})

module.exports = router;
 