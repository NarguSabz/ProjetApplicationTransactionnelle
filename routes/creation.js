var express = require('express');

var mysql = require('mysql');
var router = express.Router();

//var mongo = require('mongodb');
//var monk = require('monk');
//var db = monk('localhost:27017/protodb');


//methode http chargee de la route /creerCompte
router.get('/', function (req, res) {
    //active le lien vers la page de creation du compte et desactive tous les autres liens
    res.render('pages/creerUnCompte.ejs', { login: "", accueil: "", creationCompte: "active", produit: "" });
});

//methode qui se charge d'envoyer les informations necessaires pour la creation d'un compte
//vers la BD en s'assurant que ces entrées sont acceptables (select & insert)
router.post('/', function (req, res) {
    var userMessageText = "";
    var userMessageStatus = "";

    //var resultTest; //initialisation du premier ID a 0 si necessaire

    //collectionPanier.find({}, { _id: 0, compte_client: 0 }).sort({ numid: -1 }).limit(1, function (e, result) {
    //dbo.collection("panier").find({}, { _id: 0, compte_client: 0 }).sort({ numid: -1 }).limit(1,function (e, result) {
    //   console.log(result);
    //});

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("protodb");
        if (!checkAllFieldsEmpty(req)) {
            //resultTest = giveUserId(dbo);
            var userNameAvailable = await checkUserNameAvailable(dbo, req);
            if (userNameAvailable) {
                console.log("username check cleared");
                insertUserPanier(dbo, req, resultTest);
                insertUserCompteClient(dbo, req);
            } else {
                console.log("username check NOT cleared");
            }

        } else {

            console.log("field empty pls");
        }
        db.close();

    });
});


function insertUserPanier(dbo, req, resultTest) {
    var userUsername = req.body.username.toString().trim();
    var myobj = { /*numid: resultTest,*/ compte_client: userUsername };
    console.log(myobj);
    dbo.collection("panier").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });

}

function insertUserCompteClient(dbo, req, resultTest) {

    var userUsername = req.body.username.toString().trim();
    var userPassword = req.body.passwordUser.toString().trim();
    var userFirstname = req.body.fname.toString().trim();
    var userLastname = req.body.lname.toString().trim();
    var userEmail = req.body.email.toString().trim();
    var userAddress = req.body.adresse.toString().trim();

    var myobj = { username: userUsername, mdp: userPassword, prenom: userFirstname, nom: userLastname, email: userEmail, adresse: userAddress /*, panier_id: resultTest*/ };
    console.log( myobj);
    dbo.collection("panier").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted" );

    });

}

async function checkUserNameAvailable(dbo, req) {
    var userUsername = req.body.username.toString().trim();
    dbo.collection("panier").find({ compte_client: userUsername }).limit(1).toArray(function (err, result) {
        console.log(result);
        if (!result[0]) {
            console.log("not used")
            return 1;

        }
        console.log("used")
        return 0;
    });
}



function giveUserId(dbo) {

    dbo.collection("panier").find({}, { projection: { _id: 0, numid: 1 } }).sort({ numid: -1 }).limit(1).toArray(function (err, result) {
        //console.log(result);
        if (typeof result[0] != 'undefined') { //chercher le plus gros ID s'il existe pour iterer dessus
            resultTest = result[0].numid;
            resultTest++;
            console.log(resultTest);
            return resultTest;
        }
        return 0;
    });
    }

function checkAllFieldsEmpty(req) {
    var missingAmount = 0;

    missingAmount += checkOneFieldEmpty(req.body.username.toString());
    missingAmount += checkOneFieldEmpty(req.body.passwordUser.toString());
    missingAmount += checkOneFieldEmpty(req.body.fname.toString());
    missingAmount += checkOneFieldEmpty(req.body.lname.toString());
    missingAmount += checkOneFieldEmpty(req.body.email.toString());
    missingAmount += checkOneFieldEmpty(req.body.adresse.toString());

    return Boolean(missingAmount);
}

function checkOneFieldEmpty(fieldToCheck) {
    if (fieldToCheck.trim() == "") {
        return 1;
    }
    return 0;
}

module.exports = router;