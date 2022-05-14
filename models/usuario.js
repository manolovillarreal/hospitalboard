const { model, Schema } = require('../jsonDB/jsonDB');

const UsuarioSchema = Schema({
    id: Number,
    username: String,
    estado: Boolean,
    rol: Number,
});


module.exports = model('Usuario', UsuarioSchema);