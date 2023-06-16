const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')
const cmsController = require('./admin/cmsController')
const blogController = require('./admin/blogController')

router.use('/usuarios',usuariosController)
router.use('/cms',cmsController)
router.use('/blog',blogController)

module.exports = router