module.exports = {
  development: {
    username: "postgres",
    password: "123",
    database: "clad",
    host: "localhost",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "123",
    database: "database_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: "postgres",
    password: "123",
    database: "database_production",
    host: "localhost",
    dialect: "mysql",
  },
};
