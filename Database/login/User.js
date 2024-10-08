const Sequelize = require("sequelize")
const connection = require('../database')


const User = connection.define('ag_users',{
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    foto:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    email:{
        type:Sequelize.TEXT,
        allowNull:false,
    },
    status:{
        type: Sequelize.BOOLEAN,
        allowNull:false
    },
    senha:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isFirst:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    lastLogin:{
        type:Sequelize.DATE,
        allowNull:true
    }
},
{freezeTableName:true})

User.sync({alter: true}).then(()=>{
    console.log("Tabela User criada")
})

module.exports = User