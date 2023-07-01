const express = require('express')
const router = express.Router()
const Blog = require('../../../Database/Blog')

const multer = require('multer')
const moment = require('moment')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/blog/')
    },
    filename: function (req, file, cb) {
        cb(null,  `blog_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}` )
    }
  })
  
const upload = multer({ storage: storage })


router.get('/',async(req,res)=>{
    try {
        const blogs = await Blog.findAll()
        for (let index = 0; index < blogs.length; index++) {
            const blog = blogs[index];
            blog.ultAtu = moment(blog.updatedAt).format('DD/MM/YYYY HH:mm:SS')
        }
        res.render('admin/blog',{blogs:blogs})
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id
        let body_blog = req.flash('body_blog')
        body_blog = (body_blog == undefined || body_blog.length == 0)? undefined : JSON.parse(body_blog[0]);
        if(id.toString().toLowerCase() === 'adicionar') {
            res.render('admin/blog/form',{blog:body_blog})
        }else{
            if (isNaN(parseInt(id))) {
                req.flash('erro','Ocorreu um erro ao acessar, parametros inválidos!')
                return res.redirect('/admin/blog')
            }
            const blog = await Blog.findByPk(id)
            if(blog == undefined){
                req.flash('erro','Não foi possível encontrar cadastro do serviço na base de dados!')
                return res.redirect('/admin/blog')
            }
            if (body_blog != undefined) {
                body_blog.id = blog.id
            }
            res.render('admin/blog/form',{blog:(body_blog == undefined)?blog:body_blog})
        }
    } catch (error) {
        console.log(error)
        req.flash('erro','Ocorreu um erro ao acessar, gentileza tente novamente! Caso o erro persista entre em contato com o suporte.')
        res.redirect('/admin')
    }
})

router.post('/',upload.any(), async (req, res) => {
    try {
        let { status, categoria,titulo, autor,html,blogId } = req.body
        req.flash("body_blog",JSON.stringify(req.body))
        status = (status == true || status == 'true') ? true : false
        const files = req.files

        const blog = (blogId == '')?{id:0}:await Blog.findByPk(blogId)
        if (blogId != '' && blog ==  undefined) {
            req.flash("erro","Blog não identificado na base de dados!")
            return res.redirect('/admin/blog')
        }
        
        if (titulo == '' || titulo == undefined || autor == '' || autor == undefined || html == undefined || html == '' || categoria == undefined || categoria == '') {
            req.flash("erro",`Dados importantes como "titulo", "categoria", "autor" ou "conteudo" estão vazios, gentileza verifique e tente novamente!`)
            return (blog.id == 0)? res.redirect('/admin/blog/adicionar'):res.redirect(`/admin/blog/${blog.id}`)
        }
        
        const exist = await Blog.findOne({ where: { titulo: titulo } })
        if (exist != undefined && exist.id != blog.id){
            req.flash("erro",`Já existe um outro Conteúdo com os mesmos dados, gentileza tente novamente!`)
            return (blog.id == 0)? res.redirect('/admin/blog/adicionar'):res.redirect(`/admin/blog/${blog.id}`)
        } 
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            if (file.fieldname == 'capa') {
                req.body.capa = `${file.path.replace('public', '')}`
            } else if (file.fieldname == 'autor_foto') {
                req.body.autor_foto = `${file.path.replace('public', '')}`
            } else {
                fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
            }
        }
        
        if (blog.id == 0) {
            if (req.body.capa == undefined){
                req.flash("erro","Necessário informar foto da 'capa'!")
                return res.redirect('/admin/blog/adicionar')
            }
            await Blog.create({
                status: status,
                titulo: titulo,
                categoria: categoria,
                capa: req.body.capa,
                autor:autor,
                html:html,
                autor_foto:req.body.autor_foto
            })
        }else{
            req.body.capa = (req.body.capa == undefined)?blog.capa:req.body.capa
            req.body.autor_foto = (req.body.autor_foto == undefined)?blog.autor_foto:req.body.autor_foto
            await Blog.update({
                status: status,
                titulo: titulo,
                categoria: categoria,
                capa: req.body.capa,
                autor:autor,
                html:html,
                autor_foto:req.body.autor_foto
            },{where:{id:blog.id}})
        }
        
        req.flash("msm","Dados de Conteúdo cadastrados com sucesso!")
        res.redirect('/admin/blog')
    } catch (error) {
        console.log(error)
        req.flash("erro",'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!')
        res.redirect('/admin/blog')
        for (let index = 0; index < req.files.length; index++) {
            const file = req.files[index];
            fs.unlink(file.path, (err) => { if (err) { console.error(err) } });
        }
    }
})


module.exports = router