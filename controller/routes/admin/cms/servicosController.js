const express = require('express')
const router = express.Router()
const Servico = require('../../../../Database/cms/Servico')

const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/cms/servico')
    },
    filename: function (req, file, cb) {
        cb(null,  `servico_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}` )
    }
  })
  
const upload = multer({ storage: storage })

router.get('/',async(req,res)=>{
    try {
        const servicos = await Servico.findAll()
        for (let index = 0; index < servicos.length; index++) {
            const servico = servicos[index];
            servico.ultAtu = moment(servico.updatedAt).format('DD/MM/YYYY HH:mm:SS')
        }
        res.render('admin/cms/servicos',{servicos:servicos})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id
        if (id.toString().toLowerCase() === 'adicionar') {
            res.render('admin/cms/servicos/form',{servico:undefined})
        }else{
            if (isNaN(parseInt(id))) {
                req.flash('erro','Ocorreu um erro ao acessar, parametros inválidos!')
                return res.redirect('/admin/cms/servicos')
            }
            const servico = await Servico.findByPk(id)
            if(servico == undefined){
                req.flash('erro','Não foi possível encontrar cadastro do serviço na base de dados!')
                return res.redirect('/admin/cms/servicos')
            }
            res.render('admin/cms/servicos/form',{servico:servico})
        }
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.post('/',upload.single('img'), async (req, res) => {
    try {
        let { status, nome, descricao,html,cor,servicoId } = req.body
        status = (status == true || status == 'true') ? true : false

        const servico = (servicoId == '')?{id:0}:await Servico.findByPk(servicoId)
        if (servicoId != '' && servico ==  undefined) {
            req.flash("erro","Serviço não identificado na base de dados!")
            return res.redirect('/admin/cms/servicos')
        }

        if (nome == '' || nome == undefined || html == undefined || html == '' || descricao == undefined || descricao == '') {
            req.flash("erro",`Dados importantes como "nome", "descricao" ou "texto" estão vazios, gentileza verifique e tente novamente!`)
            return (servico.id == 0)? res.redirect('/admin/cms/servicos/adicionar'):res.redirect(`/admin/cms/servicos/${servico.id}`)
        }

        
        cor = (cor == undefined || cor == '')?'#01126c':cor
        const exist = await Servico.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != servico.id){
            req.flash("erro",`Já existe um outro Serviço com os mesmos dados, gentileza tente novamente!`)
            return (servico.id == 0)? res.redirect('/admin/cms/servicos/adicionar'):res.redirect(`/admin/cms/servicos/${servico.id}`)
        } 

        let img = servico.img
        const file = req.file
        if(file == undefined && servico.id == 0){
            req.flash("erro",`Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!`)
            return (servico.id == 0)? res.redirect('/admin/cms/servicos/adicionar'):res.redirect(`/admin/cms/servicos/${servico.id}`)
        }else if(file != undefined){
            img = `${file.path.replace('public','')}`
        }
        
        if (servico.id == 0) {
            await Servico.create({
                status: status,
                nome: nome,
                img, img,
                descricao:descricao,
                html:html,
                cor:cor
            })
        }else{
            await Servico.update({
                status: status,
                nome: nome,
                img, img,
                descricao:descricao,
                html:html,
                cor:cor
            },{where:{id:servico.id}})
        }
        
        req.flash("msm","Dados de serviços cadastrados com sucesso!")
        res.redirect('/admin/cms/servicos')
    } catch (error) {
        req.flash("erro",'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!')
        res.redirect('/admin/cms/servicos')
        fs.unlink(req.file.path, (err) => {if (err) {console.error(err)}});
    }
})


module.exports = router