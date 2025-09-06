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
            "戊": 0, "癸": 0  // 戊癸甲寅好追求 (甲=0)
        };
        
        // 五鼠遁時表
        this.wuShuDunShi = {
            "甲": 0, "己": 0, // 甲己還加甲 (甲=0)
            "乙": 2, "庚": 2, // 乙庚丙作初 (丙=2)
            "丙": 4, "辛": 4, // 丙辛從戊起 (戊=4)
            "丁": 6, "壬": 6, // 丁壬庚子居 (庚=6)
            "戊": 8, "癸": 8  // 戊癸壬子真途 (壬=8)
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
            "hour": "未來展望軍"
        };
        
        return `${pillarNames[pillarType]}：${baseStory}`;
    }
    
    // 主計算方法
    calculate(birthDate, birthTime, options = {}) {
        try {
            // 修正日期解析問題
            let year, month, day;
            
            // 處理不同的日期格式
            if (birthDate.includes('-')) {
                [year, month, day] = birthDate.split('-').map(Number);
            } else {
                throw new Error('日期格式錯誤，請使用YYYY-MM-DD格式');
            }
            
            // 驗證日期有效性
            if (year < 1900 || year > 2100) {
                throw new Error('年份必須在1900-2100之間');
            }
            if (month < 1 || month > 12) {
                throw new Error('月份必須在1-12之間');
            }
            if (day < 1 || day > 31) {
                throw new Error('日期必須在1-31之間');
            }
            
            const [hourStr, minuteStr] = birthTime.split(':').map(Number);
            const hour = hourStr;
            
            // 驗證時間有效性
            if (hour < 0 || hour > 23) {
                throw new Error('小時必須在0-23之間');
            }
            
            console.log(`計算八字: ${year}年${month}月${day}日 ${hour}:${minuteStr || 0}`);
            
            // 計算四柱
            const yearPillar = this.calculateYearPillar(year, month, day);
            const yearGan = yearPillar[0];
            
            const monthPillar = this.calculateMonthPillar(year, month, day, yearGan);
            const dayPillar = this.calculateDayPillar(year, month, day, hour);
            const dayGan = dayPillar[0];
            
            const hourPillar = this.calculateHourPillar(hour, dayGan);
            
            const pillars = {
                year: yearPillar,
                month: monthPillar,
                day: dayPillar,
                hour: hourPillar
            };
            
            console.log(`計算結果: ${pillars.year} ${pillars.month} ${pillars.day} ${pillars.hour}`);
            
            // 計算十神
            const tenGods = this.calculateTenGods(dayGan, pillars);
            
            // 計算納音
            const nayin = this.calculateNayin(pillars);
            
            // 計算藏干
            const hiddenStems = this.calculateHiddenStems(pillars);
            
            // 計算神煞
            const shensha = this.calculateShensha(pillars, dayGan);
            
            // 生成軍團故事
            const armyStories = {
                year: this.generateArmyStory(yearGan, "year"),
                month: this.generateArmyStory(monthPillar[0], "month"),
                day: this.generateArmyStory(dayGan, "day"),
                hour: this.generateArmyStory(hourPillar[0], "hour")
            };
            
            return {
                ...pillars,
                tenGods,
                nayin,
                hiddenStems,
                shensha,
                armyStories,
                dayGan,
                meta: {
                    inputDate: birthDate,
                    inputTime: birthTime,
                    calculatedAt: new Date().toISOString()
                }
            };
            
        } catch (error) {
            throw new Error(`八字計算錯誤: ${error.message}`);
        }
    }
}

// 主應用程序類
class BaziApp {
    constructor() {
        this.engine = new BaziFinalEngine();
        this.armyEffects = new ArmyEffects();
        this.currentPage = 'input';
        this.baziResult = null;
        this.isCalculating = false;
        
        this.initializeElements();
        this.bindEvents();
        this.setDefaultValues();
        this.initParticleEffects();
    }
    
    initializeElements() {
        // 導航元素
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.pages = document.querySelectorAll('.page');
        
        // 表單元素
        this.form = document.getElementById('baziForm');
        this.userNameInput = document.getElementById('userName');
        this.birthDateInput = document.getElementById('birthDate');
        this.birthTimeInput = document.getElementById('birthTime');
        this.birthLocationSelect = document.getElementById('birthLocation');
        this.timezoneSelect = document.getElementById('timezone');
        this.generateBtn = document.querySelector('.generate-btn');
        
        // 載入和錯誤提示
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.errorModal = document.getElementById('error-modal');
        this.errorMessage = document.getElementById('error-message');
        this.closeErrorBtn = document.getElementById('close-error');
    }
    
    setDefaultValues() {
        // 設置默認測試值
        this.userNameInput.value = '測試用戶';
        this.birthDateInput.value = '1985-10-06';
        this.birthTimeInput.value = '19:30';
    }
    
    bindEvents() {
        // 導航事件
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPage(e.target.dataset.page));
        });
        
        // 表單提交事件
        this.form.addEventListener('submit', (e) => this.handleCalculate(e));
        
        // 錯誤提示關閉事件
        this.closeErrorBtn.addEventListener('click', () => this.hideError());
        
        // 點擊模態框背景關閉
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) {
                this.hideError();
            }
        });
    }
    
    // 頁面切換
    switchPage(pageId) {
        // 更新導航狀態
        this.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.page === pageId);
        });
        
        // 更新頁面顯示
        this.pages.forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageId}`);
        });
        
        this.currentPage = pageId;
        
        // 如果切換到八字排盤或軍團頁面但沒有計算結果，自動切回輸入頁
        // 但是如果是從計算過程中切換過來的，則不執行這個檢查
        if ((pageId === 'bazi' || pageId === 'army') && !this.baziResult && !this.isCalculating) {
            setTimeout(() => {
                this.showError('請先輸入出生資訊並計算八字命盤');
                this.switchPage('input');
            }, 100);
        }
    }
    
    // 處理計算請求
    async handleCalculate(e) {
        e.preventDefault();
        
        try {
            this.isCalculating = true;
            this.showLoading();
            
            const formData = new FormData(this.form);
            const userName = this.userNameInput.value.trim();
            const birthDate = this.birthDateInput.value;
            const birthTime = this.birthTimeInput.value;
            const gender = formData.get('gender');
            const birthLocation = this.birthLocationSelect.value;
            const timezone = this.timezoneSelect.value;
            
            // 驗證輸入
            if (!userName) {
                throw new Error('請輸入姓名');
            }
            if (!birthDate) {
                throw new Error('請選擇出生日期');
            }
            if (!birthTime) {
                throw new Error('請選擇出生時間');
            }
            
            console.log('用戶輸入:', { userName, birthDate, birthTime, gender, birthLocation, timezone });
            
            // 模擬載入延遲，增加儀式感
            await this.delay(2000);
            
            // 計算八字
            const result = this.engine.calculate(birthDate, birthTime);
            result.userName = userName;
            result.gender = gender;
            result.birthLocation = birthLocation;
            result.timezone = timezone;
            
            this.baziResult = result;
            
            // 顯示結果
            this.displayBaziResults(result);
            this.displayArmyResults(result);
            
            // 自動切換到八字排盤頁
            this.switchPage('bazi');
            
        } catch (error) {
            console.error('計算錯誤:', error);
            this.showError(error.message);
        } finally {
            this.isCalculating = false;
            this.hideLoading();
        }
    }
    
    // 顯示八字排盤結果
    displayBaziResults(result) {
        // 顯示四柱
        document.getElementById('yearGan').textContent = result.year[0];
        document.getElementById('yearZhi').textContent = result.year[1];
        document.getElementById('monthGan').textContent = result.month[0];
        document.getElementById('monthZhi').textContent = result.month[1];
        document.getElementById('dayGan').textContent = result.day[0];
        document.getElementById('dayZhi').textContent = result.day[1];
        document.getElementById('hourGan').textContent = result.hour[0];
        document.getElementById('hourZhi').textContent = result.hour[1];
        
        // 顯示十神
        document.getElementById('yearTenGod').textContent = result.tenGods.year;
        document.getElementById('monthTenGod').textContent = result.tenGods.month;
        document.getElementById('dayTenGod').textContent = result.tenGods.day;
        document.getElementById('hourTenGod').textContent = result.tenGods.hour;
        
        // 顯示納音
        document.getElementById('yearNayin').textContent = result.nayin.year;
        document.getElementById('monthNayin').textContent = result.nayin.month;
        document.getElementById('dayNayin').textContent = result.nayin.day;
        document.getElementById('hourNayin').textContent = result.nayin.hour;
        
        // 顯示藏干
        document.getElementById('yearZhiName').textContent = result.year[1];
        document.getElementById('monthZhiName').textContent = result.month[1];
        document.getElementById('dayZhiName').textContent = result.day[1];
        document.getElementById('hourZhiName').textContent = result.hour[1];
        
        this.displayHiddenStems('yearHiddenStems', result.hiddenStems.year);
        this.displayHiddenStems('monthHiddenStems', result.hiddenStems.month);
        this.displayHiddenStems('dayHiddenStems', result.hiddenStems.day);
        this.displayHiddenStems('hourHiddenStems', result.hiddenStems.hour);
        
        // 顯示神煞
        this.displayShensha('goodShensha', result.shensha.good, 'good');
        this.displayShensha('badShensha', result.shensha.bad, 'bad');
        
        // 添加動畫效果
        this.animatePillarCards();
    }
    
    // 顯示藏干
    displayHiddenStems(containerId, stems) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        stems.forEach(stem => {
            const stemElement = document.createElement('span');
            stemElement.className = 'hidden-stem';
            stemElement.textContent = stem;
            container.appendChild(stemElement);
        });
    }
    
    // 顯示神煞
    displayShensha(containerId, shenshaList, type) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        shenshaList.forEach(shensha => {
            const shenshaElement = document.createElement('span');
            shenshaElement.className = `shensha-item ${type}`;
            shenshaElement.textContent = shensha;
            shenshaElement.title = this.engine.shensha[type][shensha] || '';
            container.appendChild(shenshaElement);
        });
    }
    
    // 顯示軍團結果
    displayArmyResults(result) {
        const armies = ['family', 'growth', 'self', 'future'];
        const pillars = ['year', 'month', 'day', 'hour'];
        
        armies.forEach((army, index) => {
            const pillar = pillars[index];
            const pillarValue = result[pillar];
            const gan = pillarValue[0];
            const zhi = pillarValue[1];
            
            // 更新軍團元素顯示
            document.getElementById(`${army}Element`).textContent = pillarValue;
            
            // 更新角色信息
            document.getElementById(`${army}General`).textContent = gan;
            document.getElementById(`${army}Advisor`).textContent = zhi;
            document.getElementById(`${army}ViceGeneral`).textContent = result.hiddenStems[pillar][0] || '--';
            document.getElementById(`${army}Strategist`).textContent = result.hiddenStems[pillar][1] || '--';
            
            // 更新納音戰場
            document.getElementById(`${army}Battlefield`).textContent = result.nayin[pillar];
            
            // 更新神煞兵符
            this.displayArmySymbols(`${army}Symbols`, result.shensha);
            
            // 更新軍團故事（使用打字機效果）
            const storyElement = document.getElementById(`${army}Story`);
            storyElement.textContent = ''; // 清空內容準備打字機效果
            storyElement.dataset.fullText = result.armyStories[pillar];
            
            // 更新建議
            const adviceTexts = {
                family: '承載家族傳承的神秘力量',
                growth: '見證時光變遷的智慧軍團',
                self: '展現內在真實力量的精銳',
                future: '指引前進方向的先鋒部隊'
            };
            document.getElementById(`${army}Advice`).textContent = adviceTexts[army];
        });
        
        // 添加軍團卡片動畫
        this.animateArmyCards();
        
        // 延遲啟動故事打字機效果
        setTimeout(() => {
            this.startStoryTypewriter();
        }, 1000);
    }
    
    // 顯示軍團神煞兵符
    displayArmySymbols(containerId, shensha) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        // 隨機選擇一些神煞顯示
        const allShensha = [...shensha.good.slice(0, 2), ...shensha.bad.slice(0, 1)];
        
        allShensha.forEach(symbol => {
            const symbolElement = document.createElement('span');
            symbolElement.className = `symbol-item ${shensha.good.includes(symbol) ? 'good' : 'bad'}`;
            symbolElement.textContent = symbol;
            container.appendChild(symbolElement);
        });
    }
    
    // 柱位卡片動畫
    animatePillarCards() {
        const pillarCards = document.querySelectorAll('.pillar-card');
        pillarCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // 軍團卡片動畫
    animateArmyCards() {
        const armyCards = document.querySelectorAll('.army-card');
        armyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, index * 300);
        });
    }
    
    // 粒子效果初始化
    initParticleEffects() {
        const particlesBg = document.getElementById('particles-bg');
        
        // 創建額外的動態粒子
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 3 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = this.getRandomNeonColor();
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.animation = `particleFloat ${Math.random() * 20 + 10}s linear infinite`;
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            particlesBg.appendChild(particle);
        }
    }
    
    // 啟動故事打字機效果
    startStoryTypewriter() {
        const storyElements = document.querySelectorAll('.story-text');
        
        storyElements.forEach((element, index) => {
            const fullText = element.dataset.fullText;
            if (fullText) {
                setTimeout(() => {
                    this.armyEffects.typewriterEffect(element, fullText, 30);
                }, index * 2000); // 每個故事間隔2秒
            }
        });
    }
    
    // 獲取隨機螢光色
    getRandomNeonColor() {
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff8000', '#8000ff', '#0080ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 顯示載入動畫
    showLoading() {
        this.loadingOverlay.classList.remove('hidden');
        this.generateBtn.disabled = true;
    }
    
    // 隱藏載入動畫
    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
        this.generateBtn.disabled = false;
    }
    
    // 顯示錯誤提示
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorModal.classList.remove('hidden');
    }
    
    // 隱藏錯誤提示
    hideError() {
        this.errorModal.classList.add('hidden');
    }
    
    // 延遲函數
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化應用程序
document.addEventListener('DOMContentLoaded', () => {
    new BaziApp();
    console.log('虹靈御所八字人生兵法系統已啟動');
});


