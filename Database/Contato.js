const Sequelize = require("sequelize")
const connection = require('./database')


const Contato = connection.define('ag_contato',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    subject:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    message:{
        type:Sequelize.TEXT,
        allowNull:false,
    },
},
{freezeTableName:true})

Contato.sync({alter: true}).then(()=>{
    console.log("Tabela Contato criada")
})

module.exports = Contato