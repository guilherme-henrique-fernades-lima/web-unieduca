const express = require('express')
const router = express.Router()
const Sobre = require('../../../Database/cms/Sobre')

// /admin/cms/sobre
router.get('/sobre',async(req,res)=>{
    try {
        const sobre = await Sobre.findOne()
        console.log(sobre)
        // sobre.titulo = 'AVD'
        res.render('admin/cms/sobre',{sobre:sobre})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

module.exports = router