const express = require('express')
const router = express.Router()


router.get('/',async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

module.exports = router