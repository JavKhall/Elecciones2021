var mongoose = require('mongoose');
var schema = mongoose.Schema;

var eleccionSchema = new schema ({
    nombre: { type = String },
    partido: { type = String },
    imagen: { type = String },
    votos: { type = Number },

    dni : { type = String }
})

module.exports = mongoose.model("Elecciones", eleccionSchema);