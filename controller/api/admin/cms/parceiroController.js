const express = require('express')
const router = express.Router()
const Parceiro = require('../../../../Database/cms/Parceiro')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/cms/parceiro')
    },
    filename: function (req, file, cb) {
        cb(null,  `funcionario_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}` )
    }
  })
  
const upload = multer({ storage: storage })

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const parceiro = await Parceiro.findByPk(id)
        if (parceiro == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Parceiro informado não identificado na base de dados!' })
        res.json({ parceiro: parceiro })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome } = req.body
        status = (status == true || status == 'true') ? true : false
        if (nome == '' || nome == undefined ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome" estão vazios, gentileza verifique e tente novamente!' })
        }

        const exist = await Parceiro.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe um outro Parceiro com os mesmos dados, gentileza tente novamente!' })

        const file = req.file
        if(file == undefined) return res.status(500).json({ erro: 'Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!' })
        const img = `${file.path.replace('public','')}`

        const newParceiro = await Parceiro.create({
            status: status,
            nome: nome,
            img, img
        })
        res.json({ resp: "Parceiro cadastrado com sucesso!", parceiro: newParceiro })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})

router.put('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome, parceiroId } = req.body
        const file = req.file
        status = (status == true || status == 'true') ? true : false
        const parceiro = await Parceiro.findByPk(parceiroId)
        if (parceiro == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro do parceiro na base de dados!' })
        if (nome == '' || nome == undefined ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome"  estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Parceiro.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != parceiro.id) return res.status(500).json({ erro: 'Já existe um outro Parceiro com os mesmos dados, gentileza tente novamente!' })

        let img = parceiro.img
        if(file != undefined) {
            img = `${file.path.replace('public','')}`
        }

        await Parceiro.update({
            status: status,
            nome: nome,
            img, img
        }, { where: { id: parceiro.id } })

        res.json({ resp: "Cadastro do Parceiro atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const parceiro = await Parceiro.findByPk(id)
        if (parceiro == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Parceiro informado não identificado na base de dados!' })
        await Parceiro.destroy({where:{id:parceiro.id}})
        res.json({ resp: 'Cadastro do parceiro deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router