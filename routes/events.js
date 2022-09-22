/*
    Events Routes
    host + /api/events
*/
const { Router } = require('express')
const { check } = require('express-validator')

const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events')

const router = Router()

// Todas tienen que pasar por la validacion del JWT
router.use( validarJWT )

// Obtener eventos
router.get( '/', getEvento )

// Crear un nuevo evento
router.post( 
    '/', 
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'Fecha de inicio es obligatoria' ).custom( isDate ),
        check( 'end', 'Fecha de finalizacion es obligatoria' ).custom( isDate ),
        validarCampos, 
    ], 
    crearEvento )

// Actualizar eventos
router.put( '/:id', actualizarEvento )

// Eliminar eventos
router.delete( '/:id', eliminarEvento )


module.exports = router