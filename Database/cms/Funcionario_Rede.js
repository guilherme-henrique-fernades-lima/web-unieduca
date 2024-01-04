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

Funcionario_Rede.belongsTo(Funcionario, {
    foreignKey: 'funcionarioId',
    as:'funcionario'
});
Funcionario.hasMany(Funcionario_Rede,{
    foreignKey: 'funcionarioId',
    as:'redes'
})

Funcionario_Rede.sync({alter: true}).then(()=>{
    console.log("Tabela Funcionario_Rede criada")
})

module.exports = Funcionario_Rede