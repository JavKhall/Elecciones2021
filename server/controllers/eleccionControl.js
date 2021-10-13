var candidatos = require('../models/candidatosModel');
var votantes = require('../models/votantesModel');

var dniAuxiliar = null;

let getVotacion = async (req, res, next) => {
    try {
        var lista = await candidatos.find({}, {});
        next({lista});
    }
    catch(err) { next ({err}) }
}

let getResultados = async (req, res, next) => {
    try {
        var cantidad = await candidatos.aggregate([{$group: { _id:' ', total:{$sum:'$votos'}}}]);
        var lista = await candidatos.find({}, {}).sort({votos: -1});
        
        var total = cantidad[0].total;
        for (let i = 0; i < lista.length; i++) {
            let porcentaje = (lista[i].votos/total)*100;       
            lista[i].votos = porcentaje.toFixed(2);
        }
        next({lista});
    }
    catch(err){ next({err}); }
};

let postRegistro = async (req, res, next) => {
    try {
        const votante = await votantes.find({dni: req.body.dni}, {});

        if (votante.length != 0) { //no esta en la base de datos
            if (votante[0].yaVoto == true) { //ya voto
                let destino = 'ya voto';
                next (destino);
                //console.log(destino);
            } 
            else { // todavia no voto, pero esta registrado
                let destino = 'no voto';
                dniAuxiliar = req.body.dni;
                next (destino);
                //console.log(destino);
            }
        }
        else {
            let dniRegitro = new votantes (
                {   dni: req.body.dni,
                    yaVoto: false
                }
            );
            let dg = await dniRegitro.save();
            let destino = 'ok';

            next(destino); //se da aviso para que se pase a la votacion
        }    
    }
    catch(err) {
        next ({err});
    }
};

let putVotacion = async (req, res, next) => {
    try {
        let voto = await candidatos.updateOne({_id: req.body.id}, {votos: parseInt(req.body.votos)+1});
        let vota = await votantes.updateOne({dni: dniAuxiliar}, {yaVoto: true});

        dniAuxiliar = null;
        next (true);
    } catch (err) {
        next (err);
    }
}

module.exports = {
    getVotacion, 
    getResultados, 
    postRegistro,
    putVotacion
};
