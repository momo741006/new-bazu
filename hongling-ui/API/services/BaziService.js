/**
 * Example integration of PostgresRepo with the existing frontend
 * This shows how the PostgresRepo can be used with the astrology calculations
 */

const PostgresRepo = require('../repository/PostgresRepo');
const dbConfig = require('../config/database');

class BaziService {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    this.repo = new PostgresRepo(dbConfig[env]);
  }

  /**
   * Save a complete bazi reading to the database
   * This integrates with the existing frontend calculation logic
   */
  async saveBaziReading(userData, calculationResult) {
    try {
      // 1. Create or get user
      let user = await this.repo.getUserByEmail(userData.email);
      if (!user) {
        user = await this.repo.createUser({
          name: userData.name,
          email: userData.email
        });
      }

      // 2. Save birth data
      const birthData = await this.repo.saveBirthData({
        userId: user.id,
        name: userData.name,
        birthYear: userData.yyyy,
        birthMonth: userData.mm,
        birthDay: userData.dd,
        birthHour: userData.hh,
        birthMinute: userData.minute || 0,
        zishiMode: userData.zMode || 'late'
      });

      // 3. Save bazi calculation
      const calculation = await this.repo.saveBaziCalculation({
        birthDataId: birthData.id,
        yearPillar: calculationResult.pillars.year.pillar,
        monthPillar: calculationResult.pillars.month.pillar,
        dayPillar: calculationResult.pillars.day.pillar,
        hourPillar: calculationResult.pillars.hour.pillar,
        tenGods: calculationResult.tenGods,
        nayin: calculationResult.nayin,
        shensha: calculationResult.shensha,
        wuxingAnalysis: calculationResult.wuxingAnalysis,
        yinyangAnalysis: calculationResult.yinyangAnalysis
      });

      // 4. Save army stories if provided
      if (calculationResult.armyStories) {
        for (const [storyType, story] of Object.entries(calculationResult.armyStories)) {
          await this.repo.saveArmyStory({
            calculationId: calculation.id,
            storyType: storyType,
            commander: story.commander,
            strategist: story.strategist,
            storyContent: story.content
          });
        }
      }

      return {
        success: true,
        data: {
          userId: user.id,
          birthDataId: birthData.id,
          calculationId: calculation.id
        }
      };

    } catch (error) {
      console.error('Error saving bazi reading:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get a user's bazi history
   */
  async getUserBaziHistory(email) {
    try {
      const user = await this.repo.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const birthRecords = await this.repo.getBirthDataByUser(user.id);
      const history = [];

      for (const birthRecord of birthRecords) {
        const calculations = await this.repo.getBaziCalculationsByBirthData(birthRecord.id);
        
        for (const calc of calculations) {
          const stories = await this.repo.getArmyStoriesByCalculation(calc.id);
          
          history.push({
            birthData: birthRecord,
            calculation: calc,
            stories: stories
          });
        }
      }

      return {
        success: true,
        data: {
          user: user,
          history: history
        }
      };

    } catch (error) {
      console.error('Error getting user history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up database connections
   */
  async close() {
    await this.repo.close();
  }
}

module.exports = BaziService;