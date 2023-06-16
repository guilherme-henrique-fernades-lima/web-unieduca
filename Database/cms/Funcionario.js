const Sequelize = require("sequelize")
const connection = require('../database')


const Funcionario = connection.define('ag_funcionario',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    competencia:{
        type:Sequelize.STRING,
        allowNull:false
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:false
    },
},
{freezeTableName:true})

Funcionario.sync({alter: true}).then(()=>{
    console.log("Tabela Funcionario criada")
})

module.exports = Funcionario