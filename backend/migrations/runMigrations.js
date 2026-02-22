const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'templedb',
  password: process.env.DB_PASSWORD || 'admin123',
  port: process.env.DB_PORT || 5432,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...\n');

    const sql = fs.readFileSync(path.join(__dirname, 'createAllTables.sql'), 'utf8');
    await client.query(sql);

    console.log('✅ All tables created successfully!');
    console.log('✅ Sample data inserted!\n');

    // Print counts
    const tables = ['events', 'services', 'staff', 'board_members', 'timings', 'gallery'];
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`   📊 ${table}: ${result.rows[0].count} rows`);
    }

    const slots = await client.query('SELECT COUNT(*) FROM timing_slots');
    console.log(`   📊 timing_slots: ${slots.rows[0].count} rows`);

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().then(() => process.exit(0)).catch(() => process.exit(1));
