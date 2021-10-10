var mongoose = require('mongoose');
var schema = mongoose.Schema;

var votantesSchema = new schema ({
    dni: {  
        type: String,
        required: true,
        length: 8
    },
    yaVoto: { type: Boolean}
});

module.exports = mongoose.model('votantes', votantesSchema);