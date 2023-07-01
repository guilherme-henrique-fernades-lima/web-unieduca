const Sequelize = require("sequelize")
const connection = require('./database')


const Blog = connection.define('ag_blog',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    categoria:{
        type:Sequelize.STRING,
        allowNull:false
    },
    titulo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    autor:{
        type:Sequelize.STRING,
        allowNull:true
    },
    autor_foto:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    html:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    capa:{
        type:Sequelize.TEXT,
        allowNull:false
    }
},
{freezeTableName:true})

Blog.sync({alter: true}).then(()=>{
    console.log("Tabela Blog criada")
})

module.exports = Blog