const express = require('express')
const router = express.Router()
const Sobre = require('../../../../Database/cms/Sobre')

router.get('/',async(req,res)=>{
    try {
        const sobre = await Sobre.findOne()
        if (sobre == undefined) return res.status(500).json({ erro: 'Não foi identificado nenhum dado na base de dados!' })
        res.json({sobre:sobre})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/',async(req,res)=>{
    try {
        req.body.status = (req.body.status == undefined || req.body.status == true || req.body.status == 'true')?true:false
        const exist = await Sobre.findOne()
        if (exist != undefined) {
            await Sobre.update(req.body,{where:{id:exist.id}})
        } else {
            await Sobre.create(req.body)
        }
        res.json({resp:'Dados do campo "Sobre nós" foram atualizados com sucesso'})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router