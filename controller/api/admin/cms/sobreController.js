const express = require('express')
const router = express.Router()
const Sobre = require('../../../../Database/cms/Sobre')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/sobre')
    },
    filename: function (req, file, cb) {
        cb(null, `sobre_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })


router.get('/', async (req, res) => {
    try {
        const sobre = await Sobre.findOne()
        if (sobre == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({ sobre: sobre })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', upload.any(), async (req, res) => {
    try {
        const files = req.files
        req.body.status = (req.body.status == undefined || req.body.status == true || req.body.status == 'true') ? true : false
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.fieldname == 'img1') {
                req.body.img1 = `${file.path.replace('public', '')}`
            } else if (file.fieldname == 'img2') {
                req.body.img2 = `${file.path.replace('public', '')}`
            } else {
                fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
            }
        }
        const exist = await Sobre.findOne()
        if (exist != undefined) {
            await Sobre.update(req.body, { where: { id: exist.id } })
        } else {
            await Sobre.create(req.body)
        }
        res.json({ resp: 'Dados do campo "Sobre nós" foram atualizados com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
        }

    }
})

module.exports = router