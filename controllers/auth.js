const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { username, password } = req.body;
    const usuarioDB = await Usuario.findOne({ username });

    //Si el usuario esta activo
    if (!usuarioDB) {
        return res.status(400).json({
            msg: 'Usuario o contraseña no son correctos - usuario'
        });
    }

    //Si el usuario esta activo
    if (!usuarioDB.estado) {
        return res.status(400).json({
            msg: 'Usuario o contraseña no son correctos - estado'
        });
    }
    //verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
    if (!validPassword) {
        return res.status(400).json({
            msg: 'Usuario o contraseña no son correctos - password'
        })
    }

    const { password: pass, ...usuario } = usuarioDB;


    //Generar JWT
    const token = await generarJWT(usuario._id);



    res.json({
        usuario: usuario,
        token
    });
}

const checkJWT = async(req, res = response) => {
    res.json({
        ok: true
    });
}
module.exports = {
    login,
    checkJWT
}