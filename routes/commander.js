var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
const panier = require('../config/Panier.js');


//methode http chargee de la route /unProduit
router.get('/', function (req, res) {
  sess = req.session;
  var utilisateur = sess.username;

  res.render('pages/checkout.ejs', {  login: "", accueil: "", creationCompte: "", produit: "", propos: "", username: utilisateur, panier: panier});
  
});

module.exports = router;