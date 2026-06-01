const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Pelicula = sequelize.define('Pelicula', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  director: {
    type: DataTypes.STRING
  },
  anio: {
    type: DataTypes.INTEGER
  },
  genero: {
    type: DataTypes.STRING
  }
});

module.exports = Pelicula;
