const Sequelize = require("sequelize")
const connection = require('../database');
const Categoria = require("./Categoria");

const Curso = connection.define('ag_curso',{
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    img:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    nome:{
        type:Sequelize.STRING,
        allowNull:false
    },
    descricao:{
        type:Sequelize.STRING,
        allowNull:false
    },
    objetivo:{
        type:Sequelize.TEXT,
        allowNull:false
    },
    contato:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isWhats:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    },
    duracao:{
        type:Sequelize.STRING,
        allowNull:true
    },
    carga_horaria:{
        type:Sequelize.STRING,
        allowNull:true
    },
    encontros:{
        type:Sequelize.STRING,
        allowNull:true
    },
    localizacao:{
        type:Sequelize.STRING,
        allowNull:true
    },
    modalidade:{
        type:Sequelize.STRING,
        allowNull:false
    },
    instituicao:{
        type:Sequelize.STRING,
        allowNull:true
    },
    documentacao:{
        type:Sequelize.STRING,
        allowNull:true
    }
},
{freezeTableName:true})

Curso.belongsTo(Categoria, {
    foreignKey: 'categoriaId',
    as:'categoria'
});
Categoria.hasMany(Curso,{
    foreignKey: 'categoriaId',
    as:'cursos'
})

Curso.sync({alter: true}).then(()=>{
    console.log("Tabela Curso criada")
})

module.exports = Curso