const Sequelize = require("sequelize")
const connection = require('../database')


const Banner = connection.define('ag_banner',{

    titulo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    texto:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:true
    },
},
{freezeTableName:true})

Banner.sync({alter: true}).then(()=>{
    console.log("Tabela Banner criada")
})

module.exports = Banner