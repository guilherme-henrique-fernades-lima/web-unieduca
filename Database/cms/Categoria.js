const Sequelize = require("sequelize")
const connection = require('../database')

const Categoria = connection.define('ag_categoria',{
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
        type:Sequelize.TEXT,
        allowNull:true  
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:false  
    }
},
{freezeTableName:true})

Categoria.sync({alter: true}).then(()=>{
    console.log("Tabela Categoria criada")
})

module.exports = Categoria