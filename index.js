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


app.get("/",(req,res)=>{
    res.render('index')
})

app.listen(PORT,()=>{
    console.log(`Serviço rodando na porta ${PORT}`)
})