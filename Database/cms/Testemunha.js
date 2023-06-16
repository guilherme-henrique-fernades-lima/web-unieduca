const Sequelize = require("sequelize")
const connection = require('../database')


const Testemunha = connection.define('ag_testemunha',{
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
    comentario:{
        type:Sequelize.STRING,
        allowNull:false
    },
    star:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:5
    }
},
{freezeTableName:true})

Testemunha.sync({alter: true}).then(()=>{
    console.log("Tabela Testemunha criada")
})

module.exports = Testemunha