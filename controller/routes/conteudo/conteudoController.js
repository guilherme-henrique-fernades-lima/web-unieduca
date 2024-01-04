const express = require('express')
const Blog = require('../../../Database/Blog')
const router = express.Router()
const moment = require('moment')
const { Op } = require('sequelize')

router.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const blog = await Blog.findByPk(id)
        if (blog == undefined) {
            req.flash('erro','Não foi possível identificar conteúdo na base de dados')
            return res.redirect('/')
        }
        blog.dataCri = moment(blog.createdAt).format('DD/MM/YYYY HH:mm')
        const blogs = await Blog.findAll({where:{status:true,id:{[Op.ne]:blog.id}}})
        res.render('conteudo',{blog:blog,blogs})
    } catch (error) {
        req.flash('erro','Ocorreu um erro durante o processamento de dados desse conteúdo')
        res.redirect('/')
    }
})

module.exports =  router