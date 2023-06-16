const Sequelize = require("sequelize")
const connection = require('../database')


const Servico = connection.define('ag_servico',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    descricao:{
        type:Sequelize.STRING,
        allowNull:false
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    html:{
        type:Sequelize.TEXT,
        allowNull:false
    }
},
{freezeTableName:true})

Servico.sync({alter: true}).then(()=>{
    console.log("Tabela Servico criada")
})

module.exports = Servico