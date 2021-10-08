var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');

//==============================INDEX==============================//
/* GET PARA LA PAGINA DE INICIO, PRESENTACION */
router.get('/', function(req, res, next) {
  res.render('index');
});
//===========================^NO TOCAR^===========================//

//==============================GETS==============================//
/* REGRISTRO DEL VOTANTE */
router.get('/registro', (req, res, next) => {
  res.render('registro');
})

/* PAGINA DE VOTACION */
router.get('/votacion', (req, res, next) => {
  candidatos.find({}, {nombre: 1, partido: 1, imagen: 1}, (err, lista) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    };
    res.status(200).render('votacion', {lista});
    //res.status(200).jsonp(lista);
  });
});

/* PAGINA DE ESTADISTICAS*/
router.get('/resultados', (req, res, next) => {
  res.render('resultados');
})

//==============================PUTS==============================//
/* PAGINA DE REGISTRO */
router.put('/registro', (req, res, next) => {
  votantes.find({dni: req.body.dni}, {}, (err, documentos) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    } else if (documentos.length == 0) {
      console.log("estaria vacio");
      votantes.updateOne({}, {$push: {dni: req.body.dni}}, (err, resultado) => {
        if (err) {
          console.log('Error: ' + err.message);
          next (err);
        } else {
          console.log(resultado);
        }
      })
    } else {
      console.log("el documento ya esta en la lista");
    };
    res.status(200).render('registro', {});
  });
});

/* PAGINA DE VOTACION */

//================================================================//

module.exports = router;
