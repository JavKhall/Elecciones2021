var mongoose = require('mongoose');
var schema = mongoose.Schema;

var candidatosSchema = new schema ({
    nombre: { type: String },
    partido: { type: String },
    imagen: { type: String },
    votos: { type: Number }
});

module.exports = mongoose.model('candidatos', candidatosSchema);