var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/protodb');

var mysql = require('mysql');
var router = express.Router();

//ajout d'une connection a la base de donnees
var connection = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "bdproto" });

//methode http chargee de la route /accueil
router.get('/', function (req, res) {
    //ceci permet d aller chercher tous le nom de categorie et de marque de chacun des produits
    var collection = db.get('produits');

   collection.aggregate([{$orderby: { date_parution : 1 }  },
     { $lookup:
        {
          from: 'categories',
          localField: 'categories_id',
          foreignField: '_id.numid',
          as: 'categories_id'
        } 
       
      } ,
      {$lookup:
        {
            from: "marques",
            localField: "marques_id",
            foreignField: "_id.numid",
            as: "marques_id"
        }}
     ],function(err, resultat) {
         if (err) throw err;           

         console.log(resultat);
        
       });

   //query permettant d aller chercher les 8 les plus recents produits, dans la base de donnees mybd, puis on passe le resultat dans le variable produits
    /*connection.query("SELECT p.id_produit, p.nom, p.description, p.date_parution, p.prix, c.nom age, m.nom marque from produit p join categories c on p.categories_id_categories = c.id_categories join marques m on p.marques_id_marque = m.id_marque order by p.date_parution desc,p.id_produit ASC limit 8;",
        function (err, resultat) { res.render('pages/index.ejs', { login: "", accueil: "active", creationCompte: "", produit: "", produits: resultat }); });
    *///on active egalement le lien vers la page d accueil et desactive tous les autres liens
});

module.exports = router;