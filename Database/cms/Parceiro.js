const Sequelize = require("sequelize")
const connection = require('../database')


const Parceiro = connection.define('ag_parceiro',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:false
    },
},
{freezeTableName:true})

Parceiro.sync({alter: true}).then(()=>{
    console.log("Tabela Parceiro criada")
})

module.exports = Parceiro