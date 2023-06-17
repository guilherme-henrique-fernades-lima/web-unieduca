const Sequelize = require("sequelize")
const connection = require('../database')


const Sobre = connection.define('ag_sobre',{
    titulo:{
        type:Sequelize.STRING,
        allowNull:true
    },
    subtitulo:{
        type:Sequelize.STRING,
        allowNull:true
    },
    img1:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    texto1:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    texto2:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    img2:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    video:{
        type:Sequelize.STRING,
        allowNull:true
    }

},
{freezeTableName:true})

Sobre.sync({alter: true}).then(()=>{
    console.log("Tabela Sobre criada")
})

module.exports = Sobre