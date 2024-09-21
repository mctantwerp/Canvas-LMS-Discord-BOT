const mysql = require('mysql2/promise');

//DATABASE INIT CONNECTION
async function createDbConnection() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    try {
      await connection.connect(); // Wait for the connection to be established
      console.log('Connected to MySQL database');
      return connection; // Return the connection for further use
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      throw error; // Rethrow the error to handle it elsewhere
    }

    return connection;
  };

module.exports = {
    createDbConnection,
};