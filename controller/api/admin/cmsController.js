const express = require('express')
const router = express.Router()

const sobreController = require('./cms/sobreController')
const parceiroController = require('./cms/parceiroController')
const videoController = require('./cms/videoController')
const servicoController = require('./cms/servicoController')
const testemunhaController = require('./cms/testemunhaController')
const funcionarioController = require('./cms/funcionarioController')
const duvidaController = require('./cms/duvidaController')

router.use('/sobre',sobreController)
router.use('/parceiro',parceiroController)
router.use('/video',videoController)
router.use('/servico',servicoController)
router.use('/testemunha',testemunhaController)
router.use('/funcionario',funcionarioController)
router.use('/duvida',duvidaController)

module.exports = router