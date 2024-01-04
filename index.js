require('dotenv').config({path:'.env-dev'})
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const path = require('path')
const moment = require('moment')

const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require('express-flash')

app.use(cookieParser("asdfasfdasfaz"))
app.use(session({
    secret: "sdfsdfsdfgdfgfgh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }
}))


app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.json())

const PORT = process.env.PORT || 7070

//usar o EJS como view engine | renderizador de html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(flash())

//Carregamento de arquivos estaticos no express
app.use(express.static(path.join(__dirname, 'public')))

// Middleware para definir a variável "erro" e msm
app.use((req, res, next) => {
    let erro = req.flash('erro');
    let msm = req.flash('msm');
    erro = (erro == undefined || erro.length == 0)?undefined:erro
    msm = (msm == undefined || msm.length == 0)?undefined:msm
    res.locals.erro = erro 
    res.locals.msm = msm 
    next();
});

const adminController = require("./controller/routes/adminController")
const loginController = require("./controller/routes/loginController")
const conteudoController = require("./controller/routes/conteudo/conteudoController")
const servicoController = require("./controller/routes/servico/servicoController")
const categoriaController = require("./controller/routes/categoria/categoriaController")
const apiController = require("./controller/api/apiController")

const Sobre = require('./Database/cms/Sobre')
const Servico = require('./Database/cms/Servico')
const Parceiro = require('./Database/cms/Parceiro')
const Video = require('./Database/cms/Video')
const Testemunha = require('./Database/cms/Testemunha')
const Funcionario = require('./Database/cms/Funcionario')
const Duvida = require('./Database/cms/Duvida')
const Funcionario_Rede = require('./Database/cms/Funcionario_Rede')
const { Op } = require('sequelize')
const Empresa = require('./Database/Empresa')
const Blog = require('./Database/Blog')
const Banner = require('./Database/cms/Banner')
const getStaticData = require('./middlewares/getStaticData')
const Categoria = require('./Database/cms/Categoria')
const Curso = require('./Database/cms/Curso')

app.use('/admin',adminController)
app.use('/login',loginController)
app.use('/api',apiController)
app.use('/conteudo',getStaticData,conteudoController)
app.use('/servicos',getStaticData,servicoController)
app.use('/categorias',getStaticData,categoriaController)


//RENDERIZA
app.get("/",getStaticData,async (req,res)=>{
    try {
        const whereSt = { status: true }
        const [sobre, parceiros, video, testemunhas, duvidas,emp,bl,banner,funcionarios,categorias] = await Promise.allSettled([
            Sobre.findOne({ where: whereSt }),
            Parceiro.findAll({ where: whereSt }),
            Video.findOne({ where: whereSt }),
            Testemunha.findAll({ where: whereSt }),
            Duvida.findAll({ where: whereSt, limit:15 }),
            Empresa.findOne(),
            Blog.findAll({where:whereSt,limit:6}),
            Banner.findOne(),
            Funcionario.findAll({where:whereSt,include:{model:Funcionario_Rede,as:'redes'},limit:6}),
            Categoria.findAll({where:{status:true},limit:8,include:{model:Curso,as:'cursos',required:true,where:{status:true},attributes:['id']}})
        ])
        const cms = {
            sobre: sobre.status === 'fulfilled' ? sobre.value : undefined,
            parceiros: parceiros.status === 'fulfilled' ? parceiros.value : [],
            video: video.status === 'fulfilled' ? video.value : undefined,
            testemunhas: testemunhas.status === 'fulfilled' ? testemunhas.value : [],
            duvidas: duvidas.status === 'fulfilled' ? duvidas.value : [],
            banner: banner.status === 'fulfilled'?banner.value:undefined,
            funcionarios:funcionarios.status === 'fulfilled'?funcionarios.value:[],
            categorias:categorias.status == 'fulfilled'?categorias.value:[]
        }
        const empresa = emp.status === 'fulfilled'?emp.value:undefined
        if (empresa) {
            let dia_atendimento_inicio = moment().isoWeekday(empresa.inicio_dia_atendimento)
            let dia_atendimento_fim = moment().isoWeekday(empresa.fim_dia_atendimento)
            empresa.atendimento = `${dia_atendimento_inicio.locale('pt-br').format('ddd')} - ${dia_atendimento_fim.locale('pt-br').format('ddd')} de ${empresa.horario_abertura}` 
        }
        const blogs = bl.status === 'fulfilled'?bl.value.map(blog =>{return {
            ...blog.dataValues,
            dataCri:moment(blog.createdAt).locale('pt-br').format('DD MMMM, YYYY')
        }}):[]

        res.render('index',{cms:cms,empresa:empresa,blogs:blogs})
    } catch (error) {
        console.log(error)
        req.flash("erro",'Ocorreu um erro ao acessar página, gentileza entre em contato com o suporte')
        res.redirect('/login')
    }
    
})

// app.get("/teste",(req,res)=>{
//     res.render('admin/index')
// })


app.listen(PORT,()=>{
    console.log(`Serviço rodando na porta ${PORT}`)
})