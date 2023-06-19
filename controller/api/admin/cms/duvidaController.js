const express = require('express')
const Duvida = require('../../../../Database/cms/Duvida')
const router = express.Router()

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const duvida = await Duvida.findByPk(id)
        if (duvida == undefined) return res.status(500).json({ erro: 'Erro ao consultar. Duvida informado não identificado na base de dados!' })
        res.json({ duvida: duvida })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})


router.post('/', async (req, res) => {
    try {
        let { status, duvida, resposta} = req.body
        status = (status == true || status == 'true') ? true : false

        if (duvida == '' || duvida == undefined || resposta == undefined || resposta == '') {
            return res.status(500).json({ erro: 'Dados importantes como "Duvida" ou "Resposta" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Duvida.findOne({ where: { duvida: duvida } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe uma outra duvida cadastrada com os mesmos dados, gentileza tente novamente!' })

        const newDuvida = await Duvida.create({
            status: status,
            duvida: duvida,
            resposta, resposta,
        })
        res.json({ resp: "Duvida cadastrada com sucesso!", duvida: newDuvida })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', async (req, res) => {
    try {
        let { status, duvida, resposta,duvidaId} = req.body
        status = (status == true || status == 'true') ? true : false
        const duvida_cad = await Duvida.findByPk(duvidaId)
        if (duvida_cad == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro da duvida na base de dados!' })

        if (duvida == '' || duvida == undefined || resposta == undefined || resposta == '') {
            return res.status(500).json({ erro: 'Dados importantes como "Duvida" ou "Resposta" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Duvida.findOne({ where: { duvida: duvida } })
        if (exist != undefined && duvida_cad.id != exist.id) return res.status(500).json({ erro: 'Já existe uma outra duvida cadastrada com os mesmos dados, gentileza tente novamente!' })

        await Duvida.update({
            status: status,
            duvida: duvida,
            resposta, resposta,
        },{where:{id:duvida_cad.id}})

        res.json({ resp: "Dúvida atualizada com sucesso!"})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const duvida = await Duvida.findByPk(id)
        if (duvida == undefined) return res.status(500).json({ erro: 'Erro ao consultar, duvida informado não identificado na base de dados!' })
        await Duvida.destroy({where:{id:duvida.id}})
        res.json({ resp: 'Cadastro da duvida foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})



module.exports = router