const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')

router.use('/usuarios',usuariosController)

router.get('/',async(req,res)=>{
    try {
        res.render('admin/index')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router