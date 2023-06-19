const Sequelize = require("sequelize")
const connection = require('../database')


const Video = connection.define('ag_video',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    titulo:{
        type:Sequelize.STRING,
        allowNull:true
    },
    texto:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    video:{
        type:Sequelize.STRING,
        allowNull:true
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:true
    }
},
{freezeTableName:true})

Video.sync({alter: true}).then(()=>{
    console.log("Tabela Video criada")
})

module.exports = Video