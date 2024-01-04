const express = require('express')
const router = express.Router()

const usuariosController = require('./admin/usuariosController')
const cmsController = require('./admin/cmsController')
const blogController = require('./admin/blogController')
const empresaController = require('./admin/empresaController')

const Contato = require('../../Database/Contato')
const auth = require('../../middlewares/auth')
const Curso = require('../../Database/cms/Curso')
const Categoria = require('../../Database/cms/Categoria')
const Curso_Mensalidade = require('../../Database/cms/Curso_Mensalidade')

router.use('/usuarios', auth, usuariosController)
router.use('/cms', auth, cmsController)
router.use('/blog', auth, blogController)
router.use('/empresa', auth, empresaController)

router.get('/curso/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({erro:'Parâmetros de consulta inválidos'})
        }

        const curso = await Curso.findOne({
            where:{
                status:true,
                id:parseInt(id)
            },
            include:[
                {required:true,model:Categoria,as:'categoria',where:{status:true},attributes:['id']},
                {required:false,model:Curso_Mensalidade,as:'mensalidades',order:[['createdAt','desc']]},
            ] 
        })
        if (!curso) {
            return res.status(400).json({erro:'Curso não identificado na base de dados do sistema'})
        }
        res.json({curso:curso})

    } catch (error) {
        res.status(500).json({erro:'Ocorreu um erro interno no servidor'})
    }
})

router.post('/sendmessage', async (req, res) => {
    try {
        let { name, subject, email, message } = req.body

        if (!name || !subject || !email || !message) {
            return res.status(400).json({ erro: 'Gentileza preencher todos os dados' })
        }

        const exist = await Contato.findOne({ where: { email: email, subject: subject } })
        if (exist) {
            return res.status(400).json({ erro: 'Já existe uma mensagem com o mesmo e-mail e titulo na base de dadoos!' })
        }
        await Contato.create({ name, subject, email, message })
        res.json({ resp: 'Ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento de dados' })
    }
})

router.get('/contatos/:id', auth, async (req, res) => {
    try {
        const id = req.params.id
        const contato = await Contato.findByPk(id)
        if (!contato) {
            return res.status(400).json({ erro: 'Não foi possível identificar contato na base de dados, recarregue a página e tente novamente!' })
        }

        res.json({ contato })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento de dados' })
    }
})

module.exports = router