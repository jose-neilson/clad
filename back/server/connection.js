const { Sequelize } = require( 'sequelize' );

const sequelize = new Sequelize( 'clad', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres'
} );

module.exports = sequelize;