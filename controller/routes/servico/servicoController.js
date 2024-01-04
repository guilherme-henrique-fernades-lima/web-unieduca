const express = require('express')
const Servico = require('../../../Database/cms/Servico')
const router = express.Router()
const moment = require('moment')

router.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const servico = await Servico.findByPk(id)
        if (servico == undefined) {
            req.flash('erro','Não foi possível identificar conteúdo na base de dados')
            return res.redirect('/')
        }
        servico.dataCri = moment(servico.createdAt).format('DD/MM/YYYY HH:mm')
        res.render('servico',{servico:servico})
    } catch (error) {
        req.flash('erro','Ocorreu um erro durante o processamento de dados desse conteúdo')
        res.redirect('/')
    }
})

module.exports =  router