const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 7070

//usar o EJS como view engine | renderizador de html
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//Carregamento de arquivos estaticos no express
app.use(express.static(path.join(__dirname, 'public')))

const adminController = require("./controller/routes/adminController")
const loginController = require("./controller/routes/loginController")

app.use('/admin',adminController)
app.use('/login',loginController)

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