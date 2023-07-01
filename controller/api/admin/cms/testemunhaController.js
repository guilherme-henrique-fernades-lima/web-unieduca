const express = require('express')
const router = express.Router()
const Testemunha = require('../../../../Database/cms/Testemunha')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/testemunha')
    },
    filename: function (req, file, cb) {
        cb(null, `testemunha_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const upload = multer({ storage: storage })

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

router.post('/', upload.single('img'), async (req, res) => {
    try {
        let { status, nome, competencia, comentario, star } = req.body
        status = (status == true || status == 'true') ? true : false
        star = (isNaN(parseInt(star)) || parseInt(star) >= 5 || parseInt(star) < 1) ? 5 : parseInt(star)

        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' || comentario == undefined || comentario == '' ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "competencia" ou "comentario" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Testemunha.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe uma outra testemunha com os mesmos dados, gentileza tente novamente!' })

        const file = req.file
        if (file == undefined) return res.status(500).json({ erro: 'Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!' })
        const img = `${file.path.replace('public', '')}`

        const newTestemunha = await Testemunha.create({
            status: status,
            nome: nome,
            img, img,
            comentario: comentario,
            star: star,
            competencia: competencia,
        })
        res.json({ resp: "Testemunha cadastrada com sucesso!", testemunha: newTestemunha })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => { if (err) { console.error(err) } });
    }
})

router.put('/', upload.single('img'), async (req, res) => {
    try {
        let { status, nome, competencia, comentario, star, testemunhaId } = req.body
        const file = req.file
        status = (status == true || status == 'true') ? true : false
        star = (isNaN(parseInt(star)) || parseInt(star) >= 5 || parseInt(star) < 1) ? 5 : parseInt(star)
        const testemunha = await Testemunha.findByPk(testemunhaId)
        if (testemunha == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro da testemunha na base de dados!' })
        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' || comentario == undefined || comentario == '' ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "competencia" ou "comentario" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Testemunha.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != testemunha.id) return res.status(500).json({ erro: 'Já existe uma outra testemunha com os mesmos dados, gentileza tente novamente!' })
        let img = testemunha.img
        if (file != undefined ) {
            img = `${file.path.replace('public', '')}`
        }

        await Testemunha.update({
            status: status,
            nome: nome,
            img, img,
            comentario: comentario,
            star: star,
            competencia: competencia,
        }, { where: { id: testemunha.id } })

        res.json({ resp: "Cadasto da Testemunha atualizada com sucesso!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => { if (err) { console.error(err) } });
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const testemunha = await Testemunha.findByPk(id)
        if (testemunha == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Testemunha informado não identificado na base de dados!' })
        await Testemunha.destroy({ where: { id: testemunha.id } })
        res.json({ resp: 'Cadastro da testemunha foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router