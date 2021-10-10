var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');
var temporaldni = 0;
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
    candidatos.find({}, {}, (err, lista) => {
      if (err) {
        console.log('Error: ' + err.message);
        next (err);
      };
      //console.log("Habilitado es :"+habilitado);
      res.status(200).render('votacion', {lista});
      //res.status(200).jsonp(lista);
    });
  } else {
    res.status(200).redirect('informacion');
  }
});

/* PAGINA DE ESTADISTICAS*/ 
router.get('/resultados', (req, res, next) => {
  res.render('resultados');
})

/* PAGINA DE INFORMACION*/
router.get('/informacion', (req, res, next) => {
  res.render('informacion');
})

//================================================================//
/* PAGINA DE REGISTRO */
router.post('/registro', (req, res, next) => {
  //se verifica si el documento ya esta en la base de datos
  votantes.find({dni: req.body.dni}, {}, (err, documento) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    } 

    // console.log(documento[0].dni);
    // res.status(200).jsonp(documento[0].dni);
    else if (documento.length != 0 )  { // el documento esta grabado
      if (documento[0].yaVoto == true) {
        console.log("el documento ya esta en la lista y ya voto");
        res.status(200).render('informacion');
      } 
      else { //aun no voto
        temporaldni = req.body.dni;
        habilitado = true; 
        res.status(200).redirect('votacion');
      }
    } 
    else { //el documente no esta grabado
      let dniRegitro = new votantes (
        { dni: req.body.dni,
          yaVoto: false
        }
      );

      dniRegitro.save((err, resultado) => {
        if (err) {
          console.log('Error: ' + err.message);
          next (err);
        } 
        else {
          temporaldni = req.body.dni;
          habilitado = true; 
          res.status(200).redirect('votacion');
        }
      }); //fin del save
    }; // final else  
  }); // final find    
}); // final post      


/* PAGINA DE VOTACION */
router.put('/votacion', (req, res, next) => {
  let suma = parseInt(req.body.votos)+1;
  console.log(temporaldni);

  candidatos.updateOne({_id: req.body.id}, {votos: suma}, (err, candidato) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    } else {
      votantes.updateOne({dni: temporaldni}, {yaVoto: true}, (err, resultado) => {
        if (err) {
          console.log('Error: ' + err.message);
          next (err);
        } else {
          console.log(resultado);
          temporaldni = 0;
          habilitado = false;
          res.status(200).render('informacion');
        }
      });


    }
  });


  {

  }








});
//================================================================//

module.exports = router;
