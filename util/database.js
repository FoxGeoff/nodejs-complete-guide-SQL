/* This depends on 'mysql' */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "test-user", "123user!!!", {
  dialect: "mysql",
  host: "localhost", // not required is default value
});

/* Database conection pool */
module.exports = sequelize;
