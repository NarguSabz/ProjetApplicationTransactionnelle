var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();

//methode http chargee de la route /unProduit
router.get('/', function (req, res) {
  sess = req.session;
  
});

module.exports = router;