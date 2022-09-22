/*
    Rutal de Usuarios / Auth
    host + /api/auth
*/
// const express = require('express')
// const router = express.Router
const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()



router.post( 
    '/new', 
    [ // middlewares
        check('name', 'Nombre requerido').not().isEmpty(),
        check('email', 'Email requerido').isEmail(),
        check('password', 'Password minimo 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ], 
    crearUsuario, 
)

router.post(
    '/', 
    [
        check('email', 'Email requerido').isEmail(),
        check('password', 'Password minimo 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario, 
)

router.get('/renew', validarJWT, revalidarToken )


module.exports = router