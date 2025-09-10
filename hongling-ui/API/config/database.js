/**
 * Database Configuration
 */

require('dotenv').config();

module.exports = {
  development: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hongling_db',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    ssl: false,
    maxConnections: 10,
    idleTimeout: 30000,
    connectionTimeout: 2000
  },
  
  production: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
      rejectUnauthorized: false
    },
    maxConnections: 20,
    idleTimeout: 30000,
    connectionTimeout: 5000
  },

  test: {
    user: process.env.TEST_DB_USER || 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    database: process.env.TEST_DB_NAME || 'hongling_test_db',
    password: process.env.TEST_DB_PASSWORD || '',
    port: process.env.TEST_DB_PORT || 5432,
    ssl: false,
    maxConnections: 5,
    idleTimeout: 30000,
    connectionTimeout: 2000
  }
};