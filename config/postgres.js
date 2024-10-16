const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This is for self-signed certificates
    },
  },
  logging: false,
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to Postgres database');
  }
};

module.exports = { sequelize, connectPostgres };
