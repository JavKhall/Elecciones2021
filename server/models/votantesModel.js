var mongoose = require('mongoose');
var schema = mongoose.Schema;

var votantesSchema = new schema ({
    dni: {  
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('votantes', votantesSchema);