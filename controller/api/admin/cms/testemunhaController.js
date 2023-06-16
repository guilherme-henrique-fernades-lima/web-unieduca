const express = require('express')
const router = express.Router()
const Testemunha = require('../../../../Database/cms/Testemunha')

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const testemunha = await Testemunha.findByPk(id)
        if (testemunha == undefined) return res.status(500).json({ erro: 'Erro ao consultar. Testemunha informado não identificado na base de dados!' })
        res.json({ testemunha: testemunha })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/', async (req, res) => {
    try {
        let { status, nome, competencia,img,comentario,star } = req.body
        status = (status == true || status == 'true') ? true : false
        star = (isNaN(parseInt(star)) || parseInt(star) >=5 || parseInt(star) < 1)?5:parseInt(star)

        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' || comentario == undefined || comentario == '' || img == undefined || img == '') {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "imagem","competencia" ou "comentario" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Testemunha.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe uma outra testemunha com os mesmos dados, gentileza tente novamente!' })

        const newTestemunha = await Testemunha.create({
            status: status,
            nome: nome,
            img, img,
            comentario:comentario,
            star:star,
            competencia:competencia,
        })
        res.json({ resp: "Testemunha cadastrada com sucesso!", testemunha: newTestemunha })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', async (req, res) => {
    try {
        let { status, nome, competencia,img,comentario,star,testemunhaId } = req.body
        status = (status == true || status == 'true') ? true : false
        star = (isNaN(parseInt(star)) || parseInt(star) >=5 || parseInt(star) < 1)?5:parseInt(star)
        const testemunha = await Testemunha.findByPk(testemunhaId)
        if (testemunha == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro da testemunha na base de dados!' })
        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' || comentario == undefined || comentario == '' || img == undefined || img == '') {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "imagem","competencia" ou "comentario" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Testemunha.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != testemunha.id) return res.status(500).json({ erro: 'Já existe uma outra testemunha com os mesmos dados, gentileza tente novamente!' })

        await Testemunha.update({
            status: status,
            nome: nome,
            img, img,
            comentario:comentario,
            star:star,
            competencia:competencia,
        },{where:{id:testemunha.id}})

        res.json({ resp: "Cadasto da Testemunha atualizada com sucesso!"})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const testemunha = await Testemunha.findByPk(id)
        if (testemunha == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Testemunha informado não identificado na base de dados!' })
        await Testemunha.destroy({where:{id:testemunha.id}})
        res.json({ resp: 'Cadastro da testemunha foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router