const Sequelize = require("sequelize")
const connection = require('../database')
const Funcionario = require('./Funcionario')

const Funcionario_Rede = connection.define('ag_funcionario_rede',{
    type:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    logo:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    link:{
        type:Sequelize.STRING,
        allowNull:false
    },
},
{freezeTableName:true})

Funcionario_Rede.hasOne(Funcionario, {
    foreignKey: 'funcionarioId'
});

Funcionario_Rede.sync({alter: true}).then(()=>{
    console.log("Tabela Funcionario_Rede criada")
})

module.exports = Funcionario_Rede