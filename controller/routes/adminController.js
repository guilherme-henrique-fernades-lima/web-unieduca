const express = require('express')
const router = express.Router()

// const usuariosController = require('./usuariosController')
// const empresaController = require('./empresaController')

// const auth_administrador = require('../../../middlewares/auth_administrador')

// router.use('/login',loginController)
// router.use('/usuarios',auth_administrador,usuariosController)
// router.use('/empresas',auth_administrador,empresaController)
// router.use('/especialistas',auth_administrador,especialistaController)
// router.use('/parametros',auth_administrador,parametrosController)

// router.get('/',auth_administrador,async(req,res)=>{
//     try {
//         res.render('administrador/index')
//     } catch (error) {
//         console.log(error)
//         res.redirect('/')
//     }
// })


router.get('/',async(req,res)=>{
    try {
        res.render('admin/index')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router