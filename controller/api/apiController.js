const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')
const cmsController = require('./admin/cmsController')

router.use('/usuarios',usuariosController)
router.use('/cms',cmsController)

module.exports = router