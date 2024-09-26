const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SQL_DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This is for self-signed certificates
    },
  },
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectPostgres };
