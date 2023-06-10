const express = require('express')
const router = express.Router()
const User = require('../../../Database/login/User')
const moment = require('moment')

router.get('/',async(req,res)=>{
    try {
        let inativo = req.query.inativo
        inativo = (inativo == 'true' || inativo == true)?true:false
        const usuarios = (inativo)? await User.findAll({order:[['id','asc']],attributes:{exclude: ['senha','nivel','foto','isFirst']}}):await User.findAll({where:{status:true},order:[['id','asc']],attributes:{exclude: ['senha','nivel','foto','isFirst']}})
        for (let index = 0; index < usuarios.length; index++) {
            const usuario = usuarios[index];
            usuario.dataCri = moment(usuario.createdAt).format('DD/MM/YYYY HH:mm')
            usuario.lastLog = moment(usuario.lastLogin).format('DD/MM/YYYY HH:mm')
        }
        res.render('admin/usuarios/usuarios',{usuarios:usuarios,inativo:inativo})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

module.exports = router