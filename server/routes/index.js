var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');

/* GET pagina de inicio */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Proyecto Final' });
});

/* GET PARA LA PAGINA DE REGRISTRO DEL VOTANTE*/
router.get('/registro', (req, res, next) => {
  res.render('registro');
})

/* GET PARA LA PAGINA DE VOTACION */
router.get('/votacion', (req, res, next) => {
  candidatos.find({}, {nombre: 1, partido: 1, imagen: 1}, (err, lista) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    };
    res.status(200).render('votacion', {lista});
    // res.status(200).jsonp(lista);
  });
});

/* GET PARA LA PAGINA DE ESTADISTICAS*/
router.get('/resultados', (req, res, next) => {
  res.render('resultados');
})
/*================================================0*/
module.exports = router;
