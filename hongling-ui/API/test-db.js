/**
 * Test script for PostgresRepo
 * Run this to verify database connection and basic operations
 */

const PostgresRepo = require('./repository/PostgresRepo');
const dbConfig = require('./config/database');

async function testDatabase() {
  console.log('🌈 虹靈御所 - Testing PostgreSQL Repository...\n');
  
  // Use development config by default
  const env = process.env.NODE_ENV || 'development';
  const config = dbConfig[env];
  
  console.log(`Using ${env} configuration:`);
  console.log(`Host: ${config.host}:${config.port}`);
  console.log(`Database: ${config.database}`);
  console.log(`User: ${config.user}\n`);
  
  const repo = new PostgresRepo(config);
  
  try {
    // Test 1: Connection
    console.log('1️⃣ Testing database connection...');
    const isConnected = await repo.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    console.log('✅ Database connection successful\n');
    
    // Test 2: Initialize tables
    console.log('2️⃣ Initializing database tables...');
    await repo.initialize();
    console.log('✅ Database tables initialized\n');
    
    // Test 3: Create a test user
    console.log('3️⃣ Testing user creation...');
    const testUser = await repo.createUser({
      name: '測試用戶',
      email: 'test@honglingpalace.com'
    });
    console.log('✅ User created:', testUser);
    console.log('');
    
    // Test 4: Save birth data
    console.log('4️⃣ Testing birth data storage...');
    const birthData = await repo.saveBirthData({
      userId: testUser.id,
      name: '測試用戶',
      birthYear: 1990,
      birthMonth: 3,
      birthDay: 15,
      birthHour: 14,
      birthMinute: 30,
      zishiMode: 'late'
    });
    console.log('✅ Birth data saved:', birthData);
    console.log('');
    
    // Test 5: Save bazi calculation
    console.log('5️⃣ Testing bazi calculation storage...');
    const calculation = await repo.saveBaziCalculation({
      birthDataId: birthData.id,
      yearPillar: '庚午',
      monthPillar: '己卯',
      dayPillar: '甲子',
      hourPillar: '辛未',
      tenGods: '年干庚:偏財, 月干己:正財, 時干辛:正官',
      nayin: '年(路旁土) 月(城頭土) 日(海中金) 時(路旁土)',
      shensha: '天乙貴人, 桃花',
      wuxingAnalysis: {
        木: 2.3,
        火: 1.8,
        土: 3.1,
        金: 2.4,
        水: 1.4
      },
      yinyangAnalysis: {
        陰: 4,
        陽: 4
      }
    });
    console.log('✅ Bazi calculation saved:', calculation);
    console.log('');
    
    // Test 6: Save army stories
    console.log('6️⃣ Testing army story storage...');
    const stories = [
      {
        calculationId: calculation.id,
        storyType: 'year',
        commander: '鋼鐵騎士',
        strategist: '烈馬騎兵',
        storyContent: '家族軍團以鋼鐵騎士為主將，烈馬騎兵為軍師，守護著古老的傳承...'
      },
      {
        calculationId: calculation.id,
        storyType: 'day',
        commander: '森林將軍',
        strategist: '夜行刺客',
        storyContent: '本我軍團以森林將軍統領，夜行刺客為謀士，在生命的戰場上...'
      }
    ];
    
    for (const story of stories) {
      const savedStory = await repo.saveArmyStory(story);
      console.log(`✅ ${story.storyType} story saved:`, savedStory.id);
    }
    console.log('');
    
    // Test 7: Retrieve data
    console.log('7️⃣ Testing data retrieval...');
    const retrievedUser = await repo.getUserById(testUser.id);
    const userBirthData = await repo.getBirthDataByUser(testUser.id);
    const calculations = await repo.getBaziCalculationsByBirthData(birthData.id);
    const armyStories = await repo.getArmyStoriesByCalculation(calculation.id);
    
    console.log('✅ Retrieved user:', retrievedUser.name);
    console.log('✅ User birth records:', userBirthData.length);
    console.log('✅ Bazi calculations:', calculations.length);
    console.log('✅ Army stories:', armyStories.length);
    console.log('');
    
    // Test 8: Custom query
    console.log('8️⃣ Testing custom query...');
    const customResult = await repo.executeQuery(
      'SELECT u.name, COUNT(bd.id) as birth_records FROM users u LEFT JOIN birth_data bd ON u.id = bd.user_id WHERE u.id = $1 GROUP BY u.id, u.name',
      [testUser.id]
    );
    console.log('✅ Custom query result:', customResult[0]);
    console.log('');
    
    console.log('🎉 All tests passed! PostgresRepo is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await repo.close();
    console.log('\n🔒 Database connection closed.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;