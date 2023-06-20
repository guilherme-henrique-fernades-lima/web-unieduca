require('dotenv').config({path:'.env-dev'})
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const path = require('path')

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

app.use('/admin',adminController)
app.use('/login',loginController)
app.use('/api',apiController)

//RENDERIZA
app.get("/",async (req,res)=>{
    try {
        const whereSt = { status: true }
        const [sobre, servicos, parceiros, video, testemunhas, duvidas,emp,bl] = await Promise.allSettled([
            Sobre.findOne({ where: whereSt }),
            Servico.findAll({ where: whereSt }),
            Parceiro.findAll({ where: whereSt }),
            Video.findOne({ where: whereSt }),
            Testemunha.findAll({ where: whereSt }),
            Duvida.findAll({ where: whereSt }),
            Empresa.findOne(),
            Blog.findAll({where:whereSt})
        ])
        const cms = {
            sobre: sobre.status === 'fulfilled' ? sobre.value : undefined,
            servicos: servicos.status === 'fulfilled' ? servicos.value : [],
            parceiros: parceiros.status === 'fulfilled' ? parceiros.value : [],
            video: video.status === 'fulfilled' ? video.value : undefined,
            testemunhas: testemunhas.status === 'fulfilled' ? testemunhas.value : [],
            duvidas: duvidas.status === 'fulfilled' ? duvidas.value : []
        }
        const empresa = emp.status === 'fulfilled'?emp.value:undefined
        const blog = bl.status === 'fulfilled'?bl.value:[]

        try {
            cms.funcionarios = await Funcionario.findAll({where:{status:true}})
            if (cms.funcionarios.length > 0) {
                const redes = await Funcionario_Rede.findAll({where:{funcionarioId:{[Op.in]:cms.funcionarios.map(cf => cf.id)}}})
                cms.funcionarios = cms.funcionarios.map(funcionario => ({
                    ...funcionario,
                    redes: redes.filter(rede => rede.funcionarioId === funcionario.id)
                }));
                
            }
        } catch (error) {
            console.log(error)
            console.log('Erro ao consultar dados do funcionarios')
        }
        console.log(cms)
        res.render('index',{cms:cms,empresa:empresa,blog:blog})
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