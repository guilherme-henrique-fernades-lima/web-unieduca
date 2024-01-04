const express = require('express')
const router = express.Router()
const moment = require('moment')

const usuariosController = require('./admin/usuariosController')
const cmsController = require('./admin/cmsController')
const blogController = require('./admin/blogController')
const loginController = require('./admin/loginController')
const Contato = require('../../Database/Contato')
const auth = require('../../middlewares/auth')


router.use('/login',loginController)
router.use('/usuarios',auth,usuariosController)
router.use('/cms',auth,cmsController)
router.use('/blog',auth,blogController)

router.get('/',auth,async(req,res)=>{
    try {
        res.render('admin/index')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/contatos',auth,async(req,res)=>{
    try {
        const contatos = await Contato.findAll({order:[["createdAt",'desc']]})
        for (const contato of contatos) {
            contato.dataCri = moment(contato.createdAt).format('DD/MM/YYYY HH:mm')
        }
        res.render('admin/contato',{contatos})
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


module.exports = router