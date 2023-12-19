const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')
const cmsController = require('./admin/cmsController')
const blogController = require('./admin/blogController')
const empresaController = require('./admin/empresaController')

router.use('/usuarios',usuariosController)
router.use('/cms',cmsController)
router.use('/blog',blogController)
router.use('/empresa',empresaController)
router.use('/empresa',empresaController)

module.exports = router