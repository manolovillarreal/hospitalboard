const { Router } = require('express');
const { check } = require('express-validator');

const { login, checkJWT } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login', [
    check('username', 'El nombre de usuario es obligatorio').notEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.get('/check', [
    validarJWT
], checkJWT);

module.exports = router;