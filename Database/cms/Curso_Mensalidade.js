const Sequelize = require("sequelize")
const connection = require('../database');
const Categoria = require("./Categoria");
const Curso = require("./Curso");

const Curso_Mensalidade = connection.define('ag_curso_mensalidade',{
    titulo:{
        type:Sequelize.STRING,
        allowNull:false
    },
    bolsa:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    mensalidade:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    valor_final:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    valor_desconto:{
        type:Sequelize.FLOAT,
        allowNull:true
    }
},
{freezeTableName:true})

Curso_Mensalidade.belongsTo(Curso, {
    foreignKey: 'cursoId',
    onDelete:'CASCADE',
    as:'curso'
});
Curso.hasMany(Curso_Mensalidade,{
    foreignKey: 'cursoId',
    as:'mensalidades'
})

Curso_Mensalidade.sync({alter: true}).then(()=>{
    console.log("Tabela Curso_Mensalidade criada")
})

module.exports = Curso_Mensalidade