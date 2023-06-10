const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')

router.use('/usuarios',usuariosController)

module.exports = router