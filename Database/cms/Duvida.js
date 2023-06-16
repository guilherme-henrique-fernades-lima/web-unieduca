const Sequelize = require("sequelize")
const connection = require('../database')


const Duvida = connection.define('ag_duvida',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    duvida:{
        type:Sequelize.STRING,
        allowNull:false
    },
    resposta:{
        type:Sequelize.TEXT,
        allowNull:false
    }
},
{freezeTableName:true})

Duvida.sync({alter: true}).then(()=>{
    console.log("Tabela Duvida criada")
})

module.exports = Duvida