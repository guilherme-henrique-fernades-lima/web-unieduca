const express = require('express')
const router = express.Router()
const Blog = require('../../../Database/Blog')
const User = require('../../../Database/login/User')

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id

        const blog = await Blog.findByPk(id)
        if (blog == undefined) return res.status(500).json({ erro: 'Erro ao consultar. Blog informado não identificado na base de dados!' })
        res.json({ blog: blog })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/', async (req, res) => {
    try {
        let { status, titulo, userId,autor,autor_foto,html,categoria,capa } = req.body
        status = (status == true || status == 'true') ? true : false
        if (titulo == '' || titulo == undefined || categoria == '' || categoria == undefined  || html == undefined || html == '' || capa == '' || capa == undefined) {
            return res.status(500).json({ erro: 'Dados importantes como "titulo", "categoria", "capa" ou "texto" estão vazios, gentileza verifique e tente novamente!' })
        }
        const user = (userId == '' || userId == undefined)?undefined:await User.findByPk(userId)
        if(user == undefined && (autor == undefined || autor == ''))return res.status(500).json({ erro: 'Dados do autor lidos como vazios, gentileza insira novamente!' })

        autor = (autor == undefined || autor == '')?user.nome:autor
        autor_foto = (autor_foto == undefined || autor_foto == '')?user.foto:autor_foto

        const exist = await Blog.findOne({ where: { titulo: titulo } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe um outro Serviço com os mesmos dados, gentileza tente novamente!' })

        const newBlog = await Blog.create({
            status: status,
            titulo: titulo,
            capa, capa,
            userId:userId,
            html:html,
            categoria:categoria,
            autor:autor,
            autor_foto:autor_foto
        })
        res.json({ resp: "Postagem cadastrada com sucesso!", blog: newBlog })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/', async (req, res) => {
    try {
        let { status, titulo, userId,autor,autor_foto,html,categoria,capa,blogId } = req.body
        status = (status == true || status == 'true') ? true : false
        const blog = await Blog.findByPk(blogId)
        if (blog == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro da postagem na base de dados!' })

        if (titulo == '' || titulo == undefined || categoria == '' || categoria == undefined  || html == undefined || html == '' || capa == '' || capa == undefined) {
            return res.status(500).json({ erro: 'Dados importantes como "titulo", "categoria", "capa" ou "texto" estão vazios, gentileza verifique e tente novamente!' })
        }
        const user = (userId == '' || userId == undefined)?undefined:await User.findByPk(userId)
        if(user == undefined && (autor == undefined || autor == ''))return res.status(500).json({ erro: 'Dados do autor lidos como vazios, gentileza insira novamente!' })

        autor = (autor == undefined || autor == '')?user.nome:autor
        autor_foto = (autor_foto == undefined || autor_foto == '')?user.foto:autor_foto

        const exist = await Blog.findOne({ where: { titulo: titulo } })
        if (exist != undefined && exist.id != blog.id) return res.status(500).json({ erro: 'Já existe um outro Serviço com os mesmos dados, gentileza tente novamente!' })

        await Blog.update({
            status: status,
            titulo: titulo,
            capa, capa,
            userId:userId,
            html:html,
            categoria:categoria,
            autor:autor,
            autor_foto:autor_foto
        },{where:{id:blog.id}})
        res.json({ resp: "Postagem atualizada com sucesso!"})
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const blog = await Blog.findByPk(id)
        if (blog == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Blog informado não identificado na base de dados!' })
        await Blog.destroy({where:{id:blog.id}})
        res.json({ resp: 'Cadastro da postagem foi deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router