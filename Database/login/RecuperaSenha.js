const Sequelize = require('sequelize')
const connection = require('../database')

const RecuperaSenha = connection.define('ag_recuperasenhas',{
    uniqid:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    aprovado:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
})

RecuperaSenha.sync({alter: true}).then(()=>{
    console.log("Tabela RecuperaSenha criada")        
})

module.exports = RecuperaSenha