/**
 * PostgreSQL Repository for 虹靈御所八字人生兵法
 * Handles database operations for user data, astrology calculations, and stories
 */

const { Pool } = require('pg');

class PostgresRepo {
  constructor(config = {}) {
    this.pool = new Pool({
      user: config.user || process.env.DB_USER || 'postgres',
      host: config.host || process.env.DB_HOST || 'localhost',
      database: config.database || process.env.DB_NAME || 'hongling_db',
      password: config.password || process.env.DB_PASSWORD || '',
      port: config.port || process.env.DB_PORT || 5432,
      ssl: config.ssl || (process.env.NODE_ENV === 'production'),
      max: config.maxConnections || 10,
      idleTimeoutMillis: config.idleTimeout || 30000,
      connectionTimeoutMillis: config.connectionTimeout || 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  /**
   * Initialize database tables if they don't exist
   */
  async initialize() {
    const client = await this.pool.connect();
    try {
      // Users table for storing user profiles
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Birth data table for storing astrology input data
      await client.query(`
        CREATE TABLE IF NOT EXISTS birth_data (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100),
          birth_year INTEGER NOT NULL,
          birth_month INTEGER NOT NULL,
          birth_day INTEGER NOT NULL,
          birth_hour INTEGER NOT NULL,
          birth_minute INTEGER DEFAULT 0,
          zishi_mode VARCHAR(10) DEFAULT 'late',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Bazi calculations table for storing computed results
      await client.query(`
        CREATE TABLE IF NOT EXISTS bazi_calculations (
          id SERIAL PRIMARY KEY,
          birth_data_id INTEGER REFERENCES birth_data(id) ON DELETE CASCADE,
          year_pillar VARCHAR(10) NOT NULL,
          month_pillar VARCHAR(10) NOT NULL,
          day_pillar VARCHAR(10) NOT NULL,
          hour_pillar VARCHAR(10) NOT NULL,
          ten_gods TEXT,
          nayin TEXT,
          shensha TEXT,
          wuxing_analysis JSONB,
          yinyang_analysis JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Stories table for storing generated army stories
      await client.query(`
        CREATE TABLE IF NOT EXISTS army_stories (
          id SERIAL PRIMARY KEY,
          calculation_id INTEGER REFERENCES bazi_calculations(id) ON DELETE CASCADE,
          story_type VARCHAR(20) NOT NULL CHECK (story_type IN ('year', 'month', 'day', 'hour')),
          commander VARCHAR(50),
          strategist VARCHAR(50),
          story_content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_birth_data_user_id ON birth_data(user_id);
        CREATE INDEX IF NOT EXISTS idx_bazi_birth_data_id ON bazi_calculations(birth_data_id);
        CREATE INDEX IF NOT EXISTS idx_stories_calculation_id ON army_stories(calculation_id);
      `);

      console.log('Database tables initialized successfully');
    } finally {
      client.release();
    }
  }

  /**
   * User Management
   */
  async createUser(userData) {
    const client = await this.pool.connect();
    try {
      const { name, email } = userData;
      const result = await client.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getUserById(userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Birth Data Management
   */
  async saveBirthData(birthData) {
    const client = await this.pool.connect();
    try {
      const {
        userId,
        name,
        birthYear,
        birthMonth,
        birthDay,
        birthHour,
        birthMinute = 0,
        zishiMode = 'late'
      } = birthData;

      const result = await client.query(
        `INSERT INTO birth_data 
         (user_id, name, birth_year, birth_month, birth_day, birth_hour, birth_minute, zishi_mode) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, name, birthYear, birthMonth, birthDay, birthHour, birthMinute, zishiMode]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getBirthDataById(birthDataId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM birth_data WHERE id = $1', [birthDataId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getBirthDataByUser(userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM birth_data WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Bazi Calculations Management
   */
  async saveBaziCalculation(calculationData) {
    const client = await this.pool.connect();
    try {
      const {
        birthDataId,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
        tenGods,
        nayin,
        shensha,
        wuxingAnalysis,
        yinyangAnalysis
      } = calculationData;

      const result = await client.query(
        `INSERT INTO bazi_calculations 
         (birth_data_id, year_pillar, month_pillar, day_pillar, hour_pillar, 
          ten_gods, nayin, shensha, wuxing_analysis, yinyang_analysis)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          birthDataId, yearPillar, monthPillar, dayPillar, hourPillar,
          tenGods, nayin, shensha,
          JSON.stringify(wuxingAnalysis),
          JSON.stringify(yinyangAnalysis)
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getBaziCalculationById(calculationId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM bazi_calculations WHERE id = $1',
        [calculationId]
      );
      if (result.rows[0]) {
        const row = result.rows[0];
        // Parse JSON fields
        row.wuxing_analysis = typeof row.wuxing_analysis === 'string' 
          ? JSON.parse(row.wuxing_analysis) 
          : row.wuxing_analysis;
        row.yinyang_analysis = typeof row.yinyang_analysis === 'string'
          ? JSON.parse(row.yinyang_analysis)
          : row.yinyang_analysis;
      }
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getBaziCalculationsByBirthData(birthDataId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM bazi_calculations WHERE birth_data_id = $1 ORDER BY created_at DESC',
        [birthDataId]
      );
      // Parse JSON fields for all rows
      return result.rows.map(row => ({
        ...row,
        wuxing_analysis: typeof row.wuxing_analysis === 'string' 
          ? JSON.parse(row.wuxing_analysis) 
          : row.wuxing_analysis,
        yinyang_analysis: typeof row.yinyang_analysis === 'string'
          ? JSON.parse(row.yinyang_analysis)
          : row.yinyang_analysis
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Army Stories Management
   */
  async saveArmyStory(storyData) {
    const client = await this.pool.connect();
    try {
      const {
        calculationId,
        storyType,
        commander,
        strategist,
        storyContent
      } = storyData;

      const result = await client.query(
        `INSERT INTO army_stories 
         (calculation_id, story_type, commander, strategist, story_content)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [calculationId, storyType, commander, strategist, storyContent]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getArmyStoriesByCalculation(calculationId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM army_stories WHERE calculation_id = $1 ORDER BY story_type',
        [calculationId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getArmyStoryByType(calculationId, storyType) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM army_stories WHERE calculation_id = $1 AND story_type = $2',
        [calculationId, storyType]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Utility Methods
   */
  async executeQuery(query, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async testConnection() {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
    console.log('Database pool closed');
  }
}

module.exports = PostgresRepo;