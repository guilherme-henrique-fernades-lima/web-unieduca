const express = require('express')
const Funcionario = require('../../../../Database/cms/Funcionario')
const Funcionario_Rede = require('../../../../Database/cms/Funcionario_Rede')
const router = express.Router()
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/cms/funcionario')
    },
    filename: function (req, file, cb) {
        cb(null,  `funcionario_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}` )
    }
  })
  
const upload = multer({ storage: storage })


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const funcionario = await Funcionario.findByPk(id,{include:{model:Funcionario_Rede,as:'redes'}})
        if (funcionario == undefined) return res.status(500).json({ erro: 'Erro ao consultar. Funcionario informado não identificado na base de dados!' })
        res.json({ funcionario: funcionario })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})


router.post('/',upload.single('img'),async (req, res) => {
    try {
        let { status, nome, competencia} = req.body
        status = (status == true || status == 'true') ? true : false

        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome" ou "competencia" estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Funcionario.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe um outro funcionario com os mesmos dados, gentileza tente novamente!' })

        const file = req.file
        if(file == undefined) return res.status(500).json({ erro: 'Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!' })
        const img = `${file.path.replace('public','')}`

        const newFuncionario = await Funcionario.create({
            status: status,
            nome: nome,
            img, img,
            competencia:competencia,
        })
        res.json({ resp: "Funcionario cadastrada com sucesso!", funcionario: newFuncionario })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        if (req.file) {
            fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
        }
    }
})

router.put('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome, competencia,funcionarioId } = req.body
        const file = req.file

        status = (status == true || status == 'true') ? true : false
        const funcionario = await Funcionario.findByPk(funcionarioId)
        if (funcionario == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro da funcionario na base de dados!' })

        if (nome == '' || nome == undefined || competencia == undefined || competencia == '' ) {
            return res.status(500).json({ erro: 'Dados importantes como "nome", ou "competencia" estão vazios, gentileza verifique e tente novamente!' })
        }

        const exist = await Funcionario.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != funcionario.id) return res.status(500).json({ erro: 'Já existe uma outra funcionario com os mesmos dados, gentileza tente novamente!' })

        let img = funcionario.img
        if(file != undefined ) {
            img = `${file.path.replace('public','')}`
        }

        await Funcionario.update({
            status: status,
            nome: nome,
            img, img,
            competencia:competencia,
        },{where:{id:funcionario.id}})

        res.json({ resp: "Cadasto da funcionario atualizada com sucesso!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        if (req.file) {
            fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
        }
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const funcionario = await Funcionario.findByPk(id)
        if (funcionario == undefined) return res.status(500).json({ erro: 'Erro ao consultar, funcionario informado não identificado na base de dados!' })
        await Funcionario.destroy({where:{id:funcionario.id}})
        res.json({ resp: 'Cadastro da funcionario foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/rede',async(req,res)=>{
    try {
        let {type,link,funcionarioId} = req.body
        let logo;
        const funcionario = await Funcionario.findByPk(funcionarioId,{include:{model:Funcionario_Rede,as:'redes'}})
        if (funcionario == undefined) return res.status(500).json({ erro: 'Erro ao consultar, funcionario informado não identificado na base de dados!' })
        if (funcionario.redes.length >=4) {
            return res.status(500).json({ erro: 'Só é possível cadastrar 4 redes para o funcionário!' })
        }
        if (isNaN(parseInt(type)) || (parseInt(type) != 99 && (parseInt(type) < 1 && parseInt(type) >= 5) ) ) {
            return res.status(500).json({ erro: 'Tipo de rede social escolhida não está de acordo com o esperado pelo sistema!' })
        }
        type = parseInt(type)
        if(!link.toString().toLowerCase().includes('http')) return res.status(500).json({ erro: 'Link da rede social informada não está de acordo com o esperado pelo sistema!' })

        switch (type) {
            case 1:
                logo = `<i class="bi bi-twitter"></i>`
                break;
            case 2:
                logo = `<i class="bi bi-facebook"></i>`
                break;
            case 3:
                logo = `<i class="bi bi-instagram"></i>`
                break;
            case 4:
                logo = `<i class="bi bi-linkedin"></i>`
                break;
            case 99:
            default:
                type = 99
                logo = `<i class="bi bi-globe"></i>`
                break;
        }

        const newRede = await Funcionario_Rede.create({
            type:type,
            logo:logo,
            link:link,
            funcionarioId:funcionario.id
        })

        res.json({ resp: "Rede Social vinculada com sucesso!", rede: newRede })

    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})

router.delete('/:funcionarioId/rede/:id', async (req, res) => {
    try {
        const funcionarioId = req.params.funcionarioId
        const id = req.params.id

        const funcionario = await Funcionario.findByPk(funcionarioId,{include:{required:true,model:Funcionario_Rede,as:'redes',where:{id:id}}})
        if (!funcionario) {
            res.status(500).json({ erro: 'Rede informada não encontrada na base de dados ou não vinculada ao funcionario informado!' })
        }
        await Funcionario_Rede.destroy({where:{id:id}})
        res.json({ resp: 'Rede social foi desvinculada com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router