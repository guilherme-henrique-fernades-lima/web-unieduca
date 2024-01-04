const express = require('express')
const router = express.Router()
const Sobre = require('../../../Database/cms/Sobre')
const Parceiro = require('../../../Database/cms/Parceiro')
const Video = require('../../../Database/cms/Video')
const Funcionario = require('../../../Database/cms/Funcionario')
const servicoController = require('./cms/servicosController')
const Testemunhas = require('../../../Database/cms/Testemunha')
const Duvida = require('../../../Database/cms/Duvida')
const Empresa = require('../../../Database/Empresa')
const moment = require('moment')
const Banner = require('../../../Database/cms/Banner')
const Funcionario_Rede = require('../../../Database/cms/Funcionario_Rede')
const Categoria = require('../../../Database/cms/Categoria')
const Curso = require('../../../Database/cms/Curso')

router.use('/servicos',servicoController)

router.get('/banner',async(req,res)=>{
    try {
        const banner = await Banner.findOne()
        res.render('admin/cms/banner',{banner:banner})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/categorias',async(req,res)=>{
    try {
        const categorias = await Categoria.findAll({include:{required:false,model:Curso,as:'cursos',where:{status:true},attributes:['id']}})
        res.render('admin/cms/categorias',{categorias:categorias})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})
router.get('/categorias/:id/cursos',async(req,res)=>{
    try {
        const id = req.params.id
        const categoria = await Categoria.findByPk(id,{include:{required:false,model:Curso,as:"cursos"}})
        console.log(categoria)
        if (!categoria) {
            req.flash('erro','Não foi possível acessar categoria selecionada')
            return res.redirect('/admin/cms/categorias')
        }
        res.render('admin/cms/categorias/cursos',{categoria:categoria})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

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

router.get('/empresa',async(req,res)=>{
    try {
        const empresa = await Empresa.findOne()
        res.render('admin/cms/empresa',{empresa:empresa})
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
        const video = await Video.findOne()
        res.render('admin/cms/videos',{video:video})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})


router.get('/funcionario',async(req,res)=>{
    try {
        const funcionarios = await Funcionario.findAll()
        res.render('admin/cms/funcionario',{funcionarios:funcionarios})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/testemunhas',async(req,res)=>{
    try {
        const testemunhas = await Testemunhas.findAll()
        console.log(testemunhas)
        res.render('admin/cms/testemunhas',{testemunhas:testemunhas})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})


router.get('/duvidas',async(req,res)=>{
    try {
        const duvidas = await Duvida.findAll()
        for (let index = 0; index < duvidas.length; index++) {
            const duvida = duvidas[index];
            duvida.ultAtu = moment(duvida.updatedAt).format('DD/MM/YYYY HH:mm:SS')
        }
        res.render('admin/cms/duvidas',{duvidas:duvidas})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

module.exports = router