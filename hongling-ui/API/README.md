# PostgresRepo - 虹靈御所八字人生兵法數據庫層

PostgreSQL repository layer for the Chinese Astrology application.

## Features

- User management (create, read user profiles)
- Birth data storage (astrology input parameters)
- Bazi calculation results storage (computed pillars, ten gods, etc.)
- Army story management (generated RPG-style narratives)
- Connection pooling and error handling
- Database schema initialization

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

3. Initialize database:
```bash
npm run init-db
```

4. Test the connection:
```bash
npm test
```

## Usage

```javascript
const PostgresRepo = require('./repository/PostgresRepo');
const dbConfig = require('./config/database');

// Initialize repository
const repo = new PostgresRepo(dbConfig.development);

// Initialize database tables
await repo.initialize();

// Create a user
const user = await repo.createUser({
  name: '用戶名',
  email: 'user@example.com'
});

// Save birth data
const birthData = await repo.saveBirthData({
  userId: user.id,
  name: '用戶名',
  birthYear: 1990,
  birthMonth: 3,
  birthDay: 15,
  birthHour: 14,
  birthMinute: 30,
  zishiMode: 'late'
});

// Save calculation results
const calculation = await repo.saveBaziCalculation({
  birthDataId: birthData.id,
  yearPillar: '庚午',
  monthPillar: '己卯',
  dayPillar: '甲子',
  hourPillar: '辛未',
  tenGods: '年干庚:偏財, 月干己:正財, 時干辛:正官',
  nayin: '年(路旁土) 月(城頭土) 日(海中金) 時(路旁土)',
  shensha: '天乙貴人, 桃花',
  wuxingAnalysis: { 木: 2.3, 火: 1.8, 土: 3.1, 金: 2.4, 水: 1.4 },
  yinyangAnalysis: { 陰: 4, 陽: 4 }
});

// Save army stories
await repo.saveArmyStory({
  calculationId: calculation.id,
  storyType: 'year',
  commander: '鋼鐵騎士',
  strategist: '烈馬騎兵',
  storyContent: '家族軍團的故事...'
});

// Retrieve data
const calculations = await repo.getBaziCalculationsByBirthData(birthData.id);
const stories = await repo.getArmyStoriesByCalculation(calculation.id);

// Clean up
await repo.close();
```

## Database Schema

### users
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- created_at, updated_at (TIMESTAMP)

### birth_data
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, references users)
- name (VARCHAR)
- birth_year, birth_month, birth_day, birth_hour, birth_minute (INTEGER)
- zishi_mode (VARCHAR)
- created_at (TIMESTAMP)

### bazi_calculations
- id (SERIAL PRIMARY KEY)
- birth_data_id (INTEGER, references birth_data)
- year_pillar, month_pillar, day_pillar, hour_pillar (VARCHAR)
- ten_gods, nayin, shensha (TEXT)
- wuxing_analysis, yinyang_analysis (JSONB)
- created_at (TIMESTAMP)

### army_stories
- id (SERIAL PRIMARY KEY)
- calculation_id (INTEGER, references bazi_calculations)
- story_type (VARCHAR: year/month/day/hour)
- commander, strategist (VARCHAR)
- story_content (TEXT)
- created_at (TIMESTAMP)

## Scripts

- `npm start` - Start the API server
- `npm run dev` - Start with nodemon for development
- `npm test` - Run database tests
- `npm run init-db` - Initialize database tables

## Environment Variables

See `.env.example` for required configuration variables.