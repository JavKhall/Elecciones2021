var express = require('express');
var router = express.Router();
var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');
var temporaldni = 0;
var habilitado = false;
var salida = [
	{
		"texto1": " ",
		"texto2": " ",
		"destino": " "
	}
];

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
    salida.texto1 = "Se verifico que no se ha registrado antes de realizar la votacion.";
    salida.texto2 = "Por favor presione en Continura para completar el formulario.";
    salida.destino = "http://localhost:3000/registro";
    res.status(200).redirect('informacion');
  }
});

/* PAGINA DE ESTADISTICAS*/ 
router.get('/resultados', (req, res, next) => {
  var valor = 0;

  candidatos.aggregate([{
    $group: { _id:' ', total:{$sum:'$votos'} } 
    }], (err, resultado) => {
  
    valor = resultado[0].total;
    console.log ("Valor de consulta: "+resultado[0].total);
    

    console.log ("Valor asignado: "+valor);
    
  
  });
  
  candidatos.find({}, {}, (err, orden) => {
    if (err) {
      console.log('Error: ' + err.message);
      next (err);
    } else {
      //orden.push(valor);
      for (let i = 0; i < orden.length; i++) {
        let porcentaje = (orden[i].votos/valor)*100;       
        orden[i].votos = porcentaje;
      }
      res.render('resultados', {orden});
      //res.status(200).jsonp(orden);
    };
  }).sort({votos: -1});

  //
  




  // ;
  
  // console.log("muestro datos");
  // console.log(datos);


  



  //
})

/* PAGINA DE INFORMACION*/
router.get('/informacion', (req, res, next) => {
  res.render('informacion', {salida});
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
        // console.log("el documento ya esta en la lista y ya voto");
        salida.texto1 = "Se verifico que el numero de documento ingresado ya se encuntra registrado en la base de datos.";
        salida.texto2 = "Por favor verifique que el numero de documento a ingresar sea el correcto.";
        salida.destino = "http://localhost:3000/registro";

        res.status(200).redirect('informacion');
      } 
      else { //aun no voto
        temporaldni = req.body.dni;
        habilitado = true; 
        salida.texto1 = "Se verifico que el numero de documento ingresado ya se encuntra registrado en la base de datos.";
        salida.texto2 = "Pero no realizo su voto correspondiente, presione Continuar para votar.";
        salida.destino = "http://localhost:3000/votacion";
        res.status(200).redirect('informacion');
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
      // actualizo estado del votante
      votantes.updateOne({dni: temporaldni}, {yaVoto: true}, (err, resultado) => {
        if (err) {
          console.log('Error: ' + err.message);
          next (err);
        } else {
          console.log(resultado);
          temporaldni = 0;
          habilitado = false;
          salida.texto1 = "Se registro con exito su votacion.";
          salida.texto2 = "Muchas Gracias por su participacion.";
          salida.destino = "http://localhost:3000/";
          res.status(200).redirect('informacion');
        }
      }); // fin de update de votantes
    } // fin del else de candidatos
  }); // fin update candidatos
}); // fin del put
//================================================================//

module.exports = router;
