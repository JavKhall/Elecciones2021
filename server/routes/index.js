var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');
var habilitado = false;

//==============================INDEX=============================//
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
  if (habilitado){
    candidatos.find({}, {nombre: 1, partido: 1, imagen: 1}, (err, lista) => {
      if (err) {
        console.log('Error: ' + err.message);
        next (err);
      };
      //console.log("Habilitado es :"+habilitado);
      res.status(200).render('votacion', {lista});
      //res.status(200).jsonp(lista);
    });
  } else {
    res.status(200).redirect('index');
  }
});

/* PAGINA DE ESTADISTICAS*/ 
router.get('/resultados', (req, res, next) => {
  res.render('resultados');
})

//================================================================//
/* PAGINA DE REGISTRO */
router.put('/registro', (req, res, next) => {
  //se verifica si el dni esta en el array, si se devuelve algo, es por que el documento esta, caso contrario, si esta vacio es xq el documento no esta cargado
  votantes.find({dni: req.body.dni}, {}, (err, documentos) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    } else if (documentos.length == 0) { //si esta vacio el numero de documento debe guardarse
      console.log("estaria vacio");
      votantes.updateOne({}, {$push: {dni: req.body.dni}}, (err, resultado) => {
        if (err) {
          console.log('Error: ' + err.message);
          next (err);
        } else {
          console.log(resultado);
        }
      })
      // deberia saltar a la siguiente pagina
      //temporaldoc = req.body.dni;
      habilitado = true; 
      res.status(200).redirect('votacion');
    } else {
      console.log("el documento ya esta en la lista");
      res.status(200).render('registro');
      // mensaje de error y de nuevo a la pagina de registro
    };
  });
});

/* PAGINA DE VOTACION */

//================================================================//

module.exports = router;
