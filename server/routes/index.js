var express = require('express');
var router = express.Router();

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
  res.render('votacion');
})

/* GET PARA LA PAGINA DE ESTADISTICAS*/
router.get('/resultados', (req, res, next) => {
  res.render('resultados');
})



/*================================================0*/
module.exports = router;
