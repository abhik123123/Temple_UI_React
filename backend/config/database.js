const { Pool } = require('pg');
require('dotenv').config();

// Determine environment and set database configuration
const isProduction = process.env.NODE_ENV === 'production';

let dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'templedb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Switch configuration based on environment
if (isProduction) {
  console.log('🚀 Using AWS RDS configuration (PRODUCTION)');
  dbConfig = {
    host: process.env.DB_AWS_HOST,
    port: parseInt(process.env.DB_AWS_PORT) || 5432,
    database: process.env.DB_AWS_NAME || 'templedb',
    user: process.env.DB_AWS_USER || 'postgres',
    password: process.env.DB_AWS_PASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
} else {
  console.log('💻 Using Local PostgreSQL configuration (DEVELOPMENT)');
  dbConfig = {
    host: process.env.DB_LOCAL_HOST || 'localhost',
    port: parseInt(process.env.DB_LOCAL_PORT) || 5432,
    database: process.env.DB_LOCAL_NAME || 'templedb',
    user: process.env.DB_LOCAL_USER || 'postgres',
    password: process.env.DB_LOCAL_PASSWORD,
    ssl: process.env.DB_LOCAL_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

// PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.on('connect', () => {
  console.log(`✓ Connected to PostgreSQL: ${isProduction ? 'AWS RDS' : 'Local'} (${dbConfig.host}:${dbConfig.port})`);
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool
const getClient = () => {
  return pool.connect();
};

module.exports = {
  query,
  getClient,
  pool,
  isProduction
};
