const Sequelize = require('sequelize')

const user = process.env.DB_USER
const host = process.env.DB_HOST
const pwd = process.env.DB_PWD
const name = process.env.DB_NAME

const  connection = new Sequelize(name, user, pwd, {
    host: host,
    dialect: 'postgres',
    logging:false,
    timezone:"-3:00",
  });


module.exports = connection