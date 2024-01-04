const express = require('express')
const Categoria = require('../../../Database/cms/Categoria')
const router = express.Router()
const moment = require('moment')
const Curso = require('../../../Database/cms/Curso')

router.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const categoria = await Categoria.findOne({where:{status:true,id:id},include:{order:[['createdAt','desc']],required:true,model:Curso,as:'cursos',where:{status:true}}})
        if (categoria == undefined) {
            req.flash('erro','Não foi possível identificar categoria na base de dados')
            return res.redirect('/')
        }
        categoria.dataCri = moment(categoria.createdAt).format('DD/MM/YYYY HH:mm')
        res.render('categoria',{categoria:categoria})
    } catch (error) {
        req.flash('erro','Ocorreu um erro durante o processamento de dados desse conteúdo')
        res.redirect('/')
    }
})

module.exports =  router