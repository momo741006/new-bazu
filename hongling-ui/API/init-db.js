/**
 * Database initialization script
 * Run this to set up the database tables for the first time
 */

const PostgresRepo = require('./repository/PostgresRepo');
const dbConfig = require('./config/database');

async function initDatabase() {
  console.log('🌈 虹靈御所 - Initializing Database...\n');
  
  const env = process.env.NODE_ENV || 'development';
  const config = dbConfig[env];
  
  console.log(`Environment: ${env}`);
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`Database: ${config.database}\n`);
  
  const repo = new PostgresRepo(config);
  
  try {
    console.log('Testing connection...');
    const isConnected = await repo.testConnection();
    
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your configuration.');
    }
    
    console.log('Creating tables...');
    await repo.initialize();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('\nTables created:');
    console.log('- users (user profiles)');
    console.log('- birth_data (astrology input data)');
    console.log('- bazi_calculations (computed results)');
    console.log('- army_stories (generated stories)');
    console.log('\nYou can now start using the application.');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database exists or user has permission to create it');
    console.error('3. Connection parameters in .env or config file are correct');
  } finally {
    await repo.close();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;