const express = require('express')
const router = express.Router()
const Video = require('../../../../Database/cms/Video')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/video')
    },
    filename: function (req, file, cb) {
        cb(null, `video_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })

router.get('/',async(req,res)=>{
    try {
        const video = await Video.findOne()
        if (video == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({video:video})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/',upload.single('img'),async(req,res)=>{
    try {
        const file = req.file
        req.body.status = ((req.body.status == undefined || req.body.status == true || req.body.status == 'true') && req.body.video != undefined)?true:false
        console.log(req.body)
        if(req.body.video != undefined && !req.body.video.toString().toLowerCase().includes('youtube') )return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza informe um vídeo do YOUTUBE!' })
        const exist = await Video.findOne()

        if (file != undefined) {
            req.body.img = `${file.path.replace('public', '')}`
        }

        if (exist != undefined) {
            req.body.img = ( req.body.img == undefined)?exist.img:req.body.img
            await Video.update(req.body,{where:{id:exist.id}})
        } else {
            await Video.create(req.body)
        }
        res.json({resp:'Dados do video foram atualizados com sucesso'})
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router