const express = require('express')
const router = express.Router()
const Empresa = require('../../../Database/Empresa')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/empresa')
    },
    filename: function (req, file, cb) {
        cb(null, `empresa_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })


router.get('/', async (req, res) => {
    try {
        const empresa = await Empresa.findOne()
        if (empresa == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({ empresa: empresa })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', upload.single('logo'), async (req, res) => {
    try {
        const file = req.file
        const exist = await Empresa.findOne()
        if (exist != undefined) {
            req.body.logo = exist.logo
            if (file != undefined && file.logo != undefined) {
                req.body.logo = `${file.logo.path.replace('public', '')}`
            }
            await Empresa.update(req.body, { where: { id: exist.id } })
        } else {
            if (file != undefined && file.logo != undefined) {
                req.body.logo = `${file.logo.path.replace('public', '')}`
            }
            await Empresa.create(req.body)
        }
        res.json({ resp: 'Dados da empresa foram atualizados com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
        }

    }
})

module.exports = router