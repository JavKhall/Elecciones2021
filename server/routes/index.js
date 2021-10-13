var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');

var eleccionControl = require('../controllers/eleccionControl');

var habilitado = false;
var salida = [
	{
		"texto1": " ",
		"texto2": " ",
		"destino": " "
	}
];

//===========================^NO TOCAR^===========================//
/* GET PARA LA PAGINA DE INICIO, PRESENTACION */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* REGRISTRO DEL VOTANTE */
router.get('/registro', (req, res, next) => {
  res.render('registro');
})

/* PAGINA DE INFO*/
router.get('/info', (req, res, next) => {
  res.render('info');
})

/* PAGINA DE INFORMACION*/
router.get('/informacion', (req, res, next) => {
  res.render('informacion', {salida});
})
//===========================^NO TOCAR^===========================//

//================================================================//
/* PAGINA DE VOTACION */
router.get('/votacion', eleccionControl.getVotacion, (result, req, res, next) => {
  if (habilitado){
    res.status(200).render('votacion', {'lista':result.lista});
  } else {
    salida.texto1 = "Se verifico que no se ha registrado antes de realizar la votacion.";
    salida.texto2 = "Por favor presione en Continura para completar el formulario.";
    salida.destino = "http://localhost:3000/registro";
    res.status(200).redirect('informacion')
  }
});

/* PAGINA DE ESTADISTICAS*/
router.get('/resultados', eleccionControl.getResultados, (result, req, res, next) => {
  res.status(200).render('resultados', {orden: result.lista});
});

//================================================================//
/* PAGINA DE REGISTRO */
router.post('/registro', eleccionControl.postRegistro, (result, req, res, next) => {
  console.log(result);
  switch (result) {
    case 'ok':
      habilitado = true;
      res.status(200).redirect('votacion');
      break;

    case 'ya voto':
      salida.texto1 = "Se verifico que el numero de documento ingresado ya se encuntra registrado en la base de datos, y ya realizo su voto.";
      salida.texto2 = "Por favor verifique que el numero de documento a ingresar sea el correcto.";
      salida.destino = "http://localhost:3000/registro";
      res.status(200).redirect('informacion');
      break;

    case 'no voto':
      habilitado = true; 
      salida.texto1 = "Se verifico que el numero de documento ingresado ya se encuntra registrado en la base de datos.";
      salida.texto2 = "Pero no realizo su voto correspondiente, presione Continuar para votar.";
      salida.destino = "http://localhost:3000/votacion";
      res.status(200).redirect('informacion');
      break;
  }
});

/* PAGINA DE VOTACION */
router.put('/votacion', eleccionControl.putVotacion, (result, req, res, next) => {
  if (result) {
    habilitado = false;
    salida.texto1 = "Se registro con exito su votacion.";
    salida.texto2 = "Muchas Gracias por su participacion.";
    salida.destino = "http://localhost:3000/";   
    res.status(200).redirect('informacion');
  }
});

//================================================================//
module.exports = router;
