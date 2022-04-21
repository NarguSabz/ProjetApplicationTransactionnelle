var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');
var router = express.Router();
var bodyParser = require('body-parser');

//methode http chargee de la route /rechercher
router.use('/', function (req, res) {
    sess = req.session;
    //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits et de aller chercher les 8 les plus recents produits, dans la base de donnees
    var collection = db.get('produits');
    nbreDeProd = req.query.nbrePage;
    if (nbreDeProd == undefined || nbreDeProd == "") {
        nbreDeProd = 9;
    }
    var filtres = req.body.filtres;

    var condition;
    var condition2;
    if (filtres.marque.length == 0) {
        condition = { "categories_id.nom": { $in: filtres.categorie } };
        condition2 = { "categories_id.nom": { $in: filtres.categorie } };


    } else if (filtres.categorie.length == 0) {
        condition = { "marques_id.Nom": { $in: filtres.marque } };
        condition2 = { "marques_id.Nom": { $in: filtres.marque } };

    } else {

        condition = { "categories_id.nom": { $in: filtres.categorie } };
        condition2 = { "marques_id.Nom": { $in: filtres.marque } };
    }

    collection.aggregate([
        {
            $lookup:
            {
                from: 'categories',
                localField: 'categories_id',
                foreignField: 'numid',
                as: 'categories_id'
            }

        },
        {
            $lookup:
            {
                from: "marques",
                localField: "marques_id",
                foreignField: "numid",
                as: "marques_id"
            }
        },
        { $match: { $and: [condition, condition2] } }
    ], function (err, resultat) {
        console.log(resultat[0])
        if (err) throw err;
        //ceci permet de savoir combien de pages sera necessaire pour henberger 20 produits par page
        var nbreDeVingts = parseInt(resultat.length / Number(nbreDeProd));
        var nbreDePages;
        if (resultat.length % Number(nbreDeProd) > 0) {
            nbreDePages = nbreDeVingts + 1;
        } else {
            nbreDePages = nbreDeVingts;
        }
        var utilisateur = sess.username;
        res.render('pages/produits.ejs', { nbrePages: nbreDePages, login: "", accueil: "", creationCompte: "", propos: "", username: utilisateur, produit: "active", produits: resultat, MotCherchee: req.query.q, nbreParPage: nbreDeProd, recherche: true, marque: req.query.marque, q: req.query.q });
        //on active egalement le lien vers la page d accueil et desactive tous les autres liens        
        db.close();
    });
});


module.exports = router;