const express = require('express')
const router = express.Router()
const Sobre = require('../../../Database/cms/Sobre')
const Parceiro = require('../../../Database/cms/Parceiro')
const Video = require('../../../Database/cms/Video')
const Funcionario = require('../../../Database/cms/Funcionario')
const servicoController = require('./cms/servicosController')

router.use('/servicos',servicoController)

// /admin/cms/sobre
router.get('/sobre',async(req,res)=>{
    try {
        const sobre = await Sobre.findOne()
        res.render('admin/cms/sobre',{sobre:sobre})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/parceiros',async(req,res)=>{
    try {
        const parceiros = await Parceiro.findAll()
        res.render('admin/cms/parceiros',{parceiros:parceiros})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/video',async(req,res)=>{
    try {
        const videos = await Video.findAll()
        res.render('admin/cms/videos',{videos:videos})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})


router.get('/funcionario',async(req,res)=>{
    try {
        const funcionario = await Funcionario.findAll()
        res.render('admin/cms/funcionario',{funcionario:funcionario})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})


module.exports = router