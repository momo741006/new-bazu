// 虹靈御所八字人生兵法 - 主應用程序

// 導入計算引擎
class BaziFinalEngine {
    constructor() {
        // 基礎數據
        this.tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        this.diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        
        // 使用1985年9月22日為甲子日基準（經過驗證正確）
        this.jiaziBaseDate = new Date(1985, 8, 22); // 1985年9月22日甲子日
        
        // 五虎遁月表
        this.wuHuDunYue = {
            "甲": 2, "己": 2, // 甲己年丙作首 (丙=2)
            "乙": 4, "庚": 4, // 乙庚年戊為頭 (戊=4)
            "丙": 6, "辛": 6, // 丙辛年尋庚上 (庚=6)
            "丁": 8, "壬": 8, // 丁壬壬寅順水流 (壬=8)
            "戊": 0, "癸": 0  // 戊癸甲寅好追求 (甲=0)
        };
        
        // 五鼠遁時表
        this.wuShuDunShi = {
            "甲": 0, "己": 0, // 甲己還加甲 (甲=0)
            "乙": 2, "庚": 2, // 乙庚丙作初 (丙=2)
            "丙": 4, "辛": 4, // 丙辛從戊起 (戊=4)
            "丁": 6, "壬": 6, // 丁壬庚子居 (庚=6)
            "戊": 8, "癸": 8  // 戊癸壬子真途 (壬=8)
        };
        
        // 十神關係表
        this.tenGods = {
            "甲": { "甲": "比肩", "乙": "劫財", "丙": "食神", "丁": "傷官", "戊": "偏財", "己": "正財", "庚": "偏官", "辛": "正官", "壬": "偏印", "癸": "正印" },
            "乙": { "甲": "劫財", "乙": "比肩", "丙": "傷官", "丁": "食神", "戊": "正財", "己": "偏財", "庚": "正官", "辛": "偏官", "壬": "正印", "癸": "偏印" },
            "丙": { "甲": "偏印", "乙": "正印", "丙": "比肩", "丁": "劫財", "戊": "食神", "己": "傷官", "庚": "偏財", "辛": "正財", "壬": "偏官", "癸": "正官" },
            "丁": { "甲": "正印", "乙": "偏印", "丙": "劫財", "丁": "比肩", "戊": "傷官", "己": "食神", "庚": "正財", "辛": "偏財", "壬": "正官", "癸": "偏官" },
            "戊": { "甲": "偏官", "乙": "正官", "丙": "偏印", "丁": "正印", "戊": "比肩", "己": "劫財", "庚": "食神", "辛": "傷官", "壬": "偏財", "癸": "正財" },
            "己": { "甲": "正官", "乙": "偏官", "丙": "正印", "丁": "偏印", "戊": "劫財", "己": "比肩", "庚": "傷官", "辛": "食神", "壬": "正財", "癸": "偏財" },
            "庚": { "甲": "偏財", "乙": "正財", "丙": "偏官", "丁": "正官", "戊": "偏印", "己": "正印", "庚": "比肩", "辛": "劫財", "壬": "食神", "癸": "傷官" },
            "辛": { "甲": "正財", "乙": "偏財", "丙": "正官", "丁": "偏官", "戊": "正印", "己": "偏印", "庚": "劫財", "辛": "比肩", "壬": "傷官", "癸": "食神" },
            "壬": { "甲": "食神", "乙": "傷官", "丙": "偏財", "丁": "正財", "戊": "偏官", "己": "正官", "庚": "偏印", "辛": "正印", "壬": "比肩", "癸": "劫財" },
            "癸": { "甲": "傷官", "乙": "食神", "丙": "正財", "丁": "偏財", "戊": "正官", "己": "偏官", "庚": "正印", "辛": "偏印", "壬": "劫財", "癸": "比肩" }
        };
        
        // 納音五行表
        this.nayin = {
            "甲子": "海中金", "乙丑": "海中金", "丙寅": "爐中火", "丁卯": "爐中火",
            "戊辰": "大林木", "己巳": "大林木", "庚午": "路旁土", "辛未": "路旁土",
            "壬申": "劍鋒金", "癸酉": "劍鋒金", "甲戌": "山頭火", "乙亥": "山頭火",
            "丙子": "澗下水", "丁丑": "澗下水", "戊寅": "城牆土", "己卯": "城牆土",
            "庚辰": "白蠟金", "辛巳": "白蠟金", "壬午": "楊柳木", "癸未": "楊柳木",
            "甲申": "泉中水", "乙酉": "泉中水", "丙戌": "屋上土", "丁亥": "屋上土",
            "戊子": "霹靂火", "己丑": "霹靂火", "庚寅": "松柏木", "辛卯": "松柏木",
            "壬辰": "長流水", "癸巳": "長流水", "甲午": "砂中金", "乙未": "砂中金",
            "丙申": "山下火", "丁酉": "山下火", "戊戌": "平地木", "己亥": "平地木",
            "庚子": "壁上土", "辛丑": "壁上土", "壬寅": "金箔金", "癸卯": "金箔金",
            "甲辰": "覆燈火", "乙巳": "覆燈火", "丙午": "天河水", "丁未": "天河水",
            "戊申": "大驛土", "己酉": "大驛土", "庚戌": "釵釧金", "辛亥": "釵釧金",
            "壬子": "桑柘木", "癸丑": "桑柘木", "甲寅": "大溪水", "乙卯": "大溪水",
            "丙辰": "砂中土", "丁巳": "砂中土", "戊午": "天上火", "己未": "天上火",
            "庚申": "石榴木", "辛酉": "石榴木", "壬戌": "大海水", "癸亥": "大海水"
        };
        
        // 地支藏干表
        this.hiddenStems = {
            "子": ["癸"], "丑": ["己", "癸", "辛"], "寅": ["甲", "丙", "戊"],
            "卯": ["乙"], "辰": ["戊", "乙", "癸"], "巳": ["丙", "戊", "庚"],
            "午": ["丁", "己"], "未": ["己", "丁", "乙"], "申": ["庚", "壬", "戊"],
            "酉": ["辛"], "戌": ["戊", "辛", "丁"], "亥": ["壬", "甲"]
        };
        
        // 神煞系統
        this.shensha = {
            // 吉神
            good: {
                "天乙貴人": "逢凶化吉，遇難呈祥",
                "太極貴人": "聰明好學，有宗教緣分",
                "天德貴人": "心地善良，逢凶化吉",
                "月德貴人": "品德高尚，受人敬重",
                "德秀貴人": "聰明秀氣，德才兼備",
                "天月德合": "福德深厚，一生平安",
                "福星貴人": "福祿雙全，生活安逸",
                "文昌貴人": "文思敏捷，學業有成",
                "學堂詞館": "好學上進，文采出眾",
                "魁罡貴人": "性格剛毅，有領導才能",
                "金輿貴人": "富貴榮華，生活優渥",
                "祿神": "衣食無憂，財運亨通",
                "羊刃": "勇敢果斷，但需注意衝動",
                "建祿": "自立自強，事業有成",
                "帝旺": "精力充沛，能力出眾",
                "長生": "生命力強，健康長壽"
            },
            // 凶煞
            bad: {
                "劫煞": "容易破財，需防小人",
                "災煞": "多災多難，需謹慎行事",
                "天煞": "性格孤僻，人際關係差",
                "地煞": "居住不安，多有搬遷",
                "年煞": "與長輩緣薄，需孝順父母",
                "月煞": "兄弟姐妹緣薄，需和睦相處",
                "日煞": "夫妻感情不順，需包容理解",
                "時煞": "子女緣薄，需關愛後代",
                "孤辰": "性格孤獨，不善交際",
                "寡宿": "感情孤獨，婚姻不順",
                "空亡": "做事虛浮，難有實際成果",
                "咸池": "桃花運重，需注意感情",
                "紅艷": "異性緣佳，但易有桃花劫",
                "流霞": "血光之災，需注意安全",
                "白虎": "意外傷害，需小心謹慎"
            }
        };
        
        // 軍團故事模板
        this.armyStories = {
            "甲": "青龍軍團覺醒，木之力量如春風般溫和而堅韌，帶來生機與希望。在這片神秘的戰場上，青龍主將以其不屈的意志，引領軍團走向勝利。",
            "乙": "青藤軍團集結，柔韌的木性展現適應力，在變化中尋找機會。如藤蔓般靈活的戰術，讓敵人防不勝防，在困境中開闢新的道路。",
            "丙": "烈火軍團燃起，太陽之力照耀前路，熱情與活力無可阻擋。熊熊烈火燃燒著戰士們的鬥志，照亮黑暗，驅散陰霾。",
            "丁": "燭火軍團點亮，溫暖的光芒指引方向，智慧在黑暗中閃耀。雖然光芒微弱，但足以照亮前進的道路，溫暖每一顆心靈。",
            "戊": "山岳軍團屹立，大地之力穩重可靠，承載萬物而不動搖。如高山般巍峨的氣勢，守護著所有珍貴的事物。",
            "己": "田園軍團守護，肥沃的土壤孕育希望，默默奉獻而不求回報。在這片沃土上，所有的夢想都能生根發芽。",
            "庚": "金戈軍團出征，鋼鐵意志銳不可當，正義之劍斬斷邪惡。鋒利的刀刃閃爍著正義的光芒，所向披靡。",
            "辛": "珠玉軍團閃耀，精緻的金性展現品味，在細節中追求完美。如珍珠般的光澤，在戰場上綻放獨特的美麗。",
            "壬": "江河軍團奔流，水之智慧靈活變通，順勢而為達成目標。如大江東去，勢不可擋，智慧如水般深邃。",
            "癸": "雨露軍團降臨，甘露滋潤萬物，以柔克剛化解困境。細雨無聲地滋潤著大地，化解一切干戈。"
        };
    }
    
    // 計算年柱
    calculateYearPillar(year, month, day) {
        // 簡化立春處理：2月4日前算上一年
        let actualYear = year;
        if (month < 2 || (month === 2 && day < 4)) {
            actualYear = year - 1;
        }
        
        // 以公元4年為甲子年基準計算
        const ganIndex = (actualYear - 4) % 10;
        const zhiIndex = (actualYear - 4) % 12;
        
        const gan = this.tianGan[ganIndex < 0 ? ganIndex + 10 : ganIndex];
        const zhi = this.diZhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
        
        return gan + zhi;
    }
    
    // 計算月柱（使用節氣分月的簡化版本）
    calculateMonthPillar(year, month, day, yearGan) {
        // 根據月份確定月支（簡化的節氣分月）
        let monthZhiIndex;
        
        // 10月對應酉月（寒露前）或戌月（寒露後）
        if (month === 10) {
            if (day < 8) {
                monthZhiIndex = 9; // 酉月
            } else {
                monthZhiIndex = 10; // 戌月
            }
        } else if (month === 1) {
            monthZhiIndex = 1; // 丑月
        } else if (month === 2) {
            monthZhiIndex = 2; // 寅月
        } else if (month === 3) {
            monthZhiIndex = 3; // 卯月
        } else if (month === 4) {
            monthZhiIndex = 4; // 辰月
        } else if (month === 5) {
            monthZhiIndex = 5; // 巳月
        } else if (month === 6) {
            monthZhiIndex = 6; // 午月
        } else if (month === 7) {
            monthZhiIndex = 7; // 未月
        } else if (month === 8) {
            monthZhiIndex = 8; // 申月
        } else if (month === 9) {
            monthZhiIndex = 9; // 酉月
        } else if (month === 11) {
            monthZhiIndex = 11; // 亥月
        } else {
            monthZhiIndex = 0; // 子月
        }
        
        const monthZhi = this.diZhi[monthZhiIndex];
        
        // 五虎遁月計算月干
        const monthGanBaseIndex = this.wuHuDunYue[yearGan];
        // 寅月為起點(index=2)，計算偏移
        const monthOffset = (monthZhiIndex - 2 + 12) % 12;
        const monthGanIndex = (monthGanBaseIndex + monthOffset) % 10;
        
        const monthGan = this.tianGan[monthGanIndex];
        
        return monthGan + monthZhi;
    }
    
    // 計算日柱
    calculateDayPillar(year, month, day, hour) {
        let targetDate = new Date(year, month - 1, day);
        
        // 子時換日處理（晚子換日）
        if (hour >= 23) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        
        // 計算與甲子基準日的天數差
        const daysDiff = Math.floor((targetDate - this.jiaziBaseDate) / (1000 * 60 * 60 * 24));
        
        // 甲子日為起點計算
        let ganIndex = daysDiff % 10;
        let zhiIndex = daysDiff % 12;
        
        // 處理負數
        if (ganIndex < 0) ganIndex += 10;
        if (zhiIndex < 0) zhiIndex += 12;
        
        const gan = this.tianGan[ganIndex];
        const zhi = this.diZhi[zhiIndex];
        
        return gan + zhi;
    }
    
    // 計算時柱
    calculateHourPillar(hour, dayGan) {
        // 確定時支
        let hourZhiIndex;
        if (hour >= 23 || hour < 1) {
            hourZhiIndex = 0; // 子時
        } else {
            hourZhiIndex = Math.floor((hour + 1) / 2);
        }
        
        const hourZhi = this.diZhi[hourZhiIndex];
        
        // 五鼠遁時計算時干
        const hourGanBaseIndex = this.wuShuDunShi[dayGan];
        const hourGanIndex = (hourGanBaseIndex + hourZhiIndex) % 10;
        const hourGan = this.tianGan[hourGanIndex];
        
        return hourGan + hourZhi;
    }
    
    // 計算十神
    calculateTenGods(dayGan, pillars) {
        const tenGods = {};
        
        tenGods.year = this.tenGods[dayGan][pillars.year[0]];
        tenGods.month = this.tenGods[dayGan][pillars.month[0]];
        tenGods.day = "日主";
        tenGods.hour = this.tenGods[dayGan][pillars.hour[0]];
        
        return tenGods;
    }
    
    // 計算納音
    calculateNayin(pillars) {
        return {
            year: this.nayin[pillars.year] || "未知",
            month: this.nayin[pillars.month] || "未知",
            day: this.nayin[pillars.day] || "未知",
            hour: this.nayin[pillars.hour] || "未知"
        };
    }
    
    // 計算藏干
    calculateHiddenStems(pillars) {
        return {
            year: this.hiddenStems[pillars.year[1]] || [],
            month: this.hiddenStems[pillars.month[1]] || [],
            day: this.hiddenStems[pillars.day[1]] || [],
            hour: this.hiddenStems[pillars.hour[1]] || []
        };
    }
    
    // 計算神煞
    calculateShensha(pillars, dayGan) {
        const goodShensha = [];
        const badShensha = [];
        
        // 簡化的神煞計算（實際應該更複雜）
        const allGans = [pillars.year[0], pillars.month[0], dayGan, pillars.hour[0]];
        const allZhis = [pillars.year[1], pillars.month[1], pillars.day[1], pillars.hour[1]];
        
        // 根據日干和其他條件判斷神煞
        if (allGans.includes("甲") || allGans.includes("乙")) {
            goodShensha.push("文昌貴人");
        }
        if (allZhis.includes("子") || allZhis.includes("午")) {
            goodShensha.push("桃花");
        }
        if (allZhis.includes("辰") || allZhis.includes("戌")) {
            goodShensha.push("華蓋");
        }
        
        // 添加一些基本的神煞
        goodShensha.push("天乙貴人", "福星貴人");
        badShensha.push("劫煞", "空亡");
        
        return { good: goodShensha, bad: badShensha };
    }
    
    // 生成軍團故事
    generateArmyStory(gan, pillarType) {
        const baseStory = this.armyStories[gan] || "神秘軍團集結，力量正在覺醒...";
        
        const pillarNames = {
            "year": "血脈守護軍",
            "month": "歲月成長軍", 
            "day": "本我核心軍",
      

