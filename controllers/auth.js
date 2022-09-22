const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async( req, res = response ) => {

    // console.log(req.body)
    const { email, password } = req.body

    // if ( name.length < 5 ){
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre minimo 5 carateres'
    //     })
    // }

    // Manejo de errores

    try {

        let usuario =  await Usuario.findOne({ email })
        // console.log(usuario)
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'email ya utilizado'
            })
        }


        usuario = new Usuario( req.body )

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save()

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name )
    
        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            // name,
            // email,
            // password,
    })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
   
    

}

const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body

    try {
        
        const usuario =  await Usuario.findOne({ email })

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        // Confirmar passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            })
        }

        // Generar nuestro JWT (Jason Web Token)
        const token = await generarJWT( usuario.id, usuario.name )

        res.status(202).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

    

const revalidarToken = async(req, res = reponse ) => {
    
    const { uid, name } = req

    // Generar nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT( uid, name )

    res.json({
        ok: true,
        token,
    })

}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}