const express = require('express')
const router = express.Router()
const Video = require('../../../../Database/cms/Video')

router.get('/',async(req,res)=>{
    try {
        const video = await Video.findOne()
        if (video == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({video:video})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/',async(req,res)=>{
    try {
        req.body.status = ((req.body.status == undefined || req.body.status == true || req.body.status == 'true') && req.body.video != undefined)?true:false
        if(req.body.video != undefined && !req.body.video.toString().toLowerCase().includes('youtube') )return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza informe um vídeo do YOUTUBE!' })
        const exist = await Video.findOne()
        if (exist != undefined) {
            await Video.update(req.body,{where:{id:exist.id}})
        } else {
            await Video.create(req.body)
        }
        res.json({resp:'Dados do video foram atualizados com sucesso'})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router