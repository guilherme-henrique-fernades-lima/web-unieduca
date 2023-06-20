const Sequelize = require("sequelize")
const connection = require('./database')


const Empresa = connection.define('ag_empresa',{
    logo:{
        type:Sequelize.TEXT,
        allowNull:false
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
    }
},
{freezeTableName:true})

Empresa.sync({alter: true}).then(()=>{
    console.log("Tabela Empresa criada")
})

module.exports = Empresa