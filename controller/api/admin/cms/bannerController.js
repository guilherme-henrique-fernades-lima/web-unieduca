const express = require('express')
const router = express.Router()
const Banner = require('../../../../Database/cms/Banner')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/banner')
    },
    filename: function (req, file, cb) {
        cb(null, `sobre_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })


router.get('/', async (req, res) => {
    try {
        const banner = await Banner.findOne()
        if (banner == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({ banner: banner })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        if (file) {
            req.body.img = `${file.path.replace('public', '')}`
        }
        
        const exist = await Banner.findOne()
        if (exist != undefined) {
            req.body.img = (req.body.img == undefined)?exist.img:req.body.img
            await Banner.update(req.body, { where: { id: exist.id } })
        } else {
            await Banner.create(req.body)
        }
        res.json({ resp: 'Dados do Banner inicial foram atualizados com sucesso' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
        }

    }
})

module.exports = router