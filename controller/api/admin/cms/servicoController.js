const express = require('express')
const router = express.Router()
const Servico = require('../../../../Database/cms/Servico')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/cms/servico')
    },
    filename: function (req, file, cb) {
        cb(null,  `funcionario_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}` )
    }
  })
  
const upload = multer({ storage: storage })

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const servico = await Servico.findByPk(id)
        if (servico == undefined) return res.status(500).json({ erro: 'Erro ao consultar. Serviço informado não identificado na base de dados!' })
        res.json({ servico: servico })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome, descricao,html,cor } = req.body
        status = (status == true || status == 'true') ? true : false
        if (nome == '' || nome == undefined || html == undefined || html == '' || descricao == undefined || descricao == '') {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "imagem","descricao" ou "texto" estão vazios, gentileza verifique e tente novamente!' })
        }
        cor = (cor == undefined || cor == '')?'#01126c':cor
        const exist = await Servico.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe um outro Serviço com os mesmos dados, gentileza tente novamente!' })

        const file = req.file
        if(file == undefined || file.img == undefined) return res.status(500).json({ erro: 'Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!' })
        const img = `${file.img.path.replace('public','')}`

        const newServico = await Servico.create({
            status: status,
            nome: nome,
            img, img,
            descricao:descricao,
            html:html,
            cor:cor
        })
        res.json({ resp: "Serviço cadastrado com sucesso!", servico: newServico })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})

router.put('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome, descricao,html,servicoId,cor } = req.body
        const file = req.file
        status = (status == true || status == 'true') ? true : false
        const servico = await Servico.findByPk(servicoId)
        if (servico == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro do serviço na base de dados!' })

        if (nome == '' || nome == undefined || html == undefined || html == '' || descricao == undefined || descricao == '') {
            return res.status(500).json({ erro: 'Dados importantes como "nome", "imagem","descricao" ou "texto" estão vazios, gentileza verifique e tente novamente!' })
        }
        cor = (cor == undefined || cor == '')?'#01126c':cor

        const exist = await Servico.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != servico.id) return res.status(500).json({ erro: 'Já existe um outro Serviço com os mesmos dados, gentileza tente novamente!' })

        let img = servico.img
        if(file != undefined && file.img != undefined) {
            img = `${file.img.path.replace('public','')}`
        }

        await Servico.update({
            status: status,
            nome: nome,
            img, img,
            descricao:descricao,
            html:html,
            cor:cor
        },{id:servico.id})

        res.json({ resp: "Serviço cadastrado com sucesso!"})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const servico = await Servico.findByPk(id)
        if (servico == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Serviço informado não identificado na base de dados!' })
        await Servico.destroy({where:{id:servico.id}})
        res.json({ resp: 'Cadastro do serviço foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router