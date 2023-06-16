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

app.use('/admin',adminController)
app.use('/login',loginController)
app.use('/api',apiController)

//RENDERIZA
app.get("/",(req,res)=>{
    var nome = "<h1>DAVI<h1>"
    console.log(nome)
    res.render('index',{nome:nome})
})

// app.get("/teste",(req,res)=>{
//     res.render('admin/index')
// })


app.listen(PORT,()=>{
    console.log(`Serviço rodando na porta ${PORT}`)
})