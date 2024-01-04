const Sequelize = require("sequelize")
const connection = require('./database')


const Empresa = connection.define('ag_empresa',{
    logo:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'Empresa'
    },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    likedin:{
        type:Sequelize.STRING,
        allowNull:false
    },
    facebook:{
        type:Sequelize.STRING,
        allowNull:true
    },
    instagram:{
        type:Sequelize.STRING,
        allowNull:true
    },
    whatsapp:{
        type:Sequelize.STRING,
        allowNull:true
    },
    telefone:{
        type:Sequelize.STRING,
        allowNull:true
    },
    twitter:{
        type:Sequelize.STRING,
        allowNull:true
    },
    endereco:{
        type:Sequelize.STRING,
        allowNull:false
    },
    telefone:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    horario_abertura:{
        type:Sequelize.STRING,
        allowNull:false
    },
    inicio_dia_atendimento:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
    },
    fim_dia_atendimento:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:5
    },
},
{freezeTableName:true})

Empresa.sync({alter: true}).then(()=>{
    console.log("Tabela Empresa criada")
})

module.exports = Empresa