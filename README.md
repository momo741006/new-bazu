# 虹靈御所 - 八字人生兵法

虹靈御所獨創「四時軍團系統」，透過故事化、角色化與策略化方式呈現命理資訊，讓年輕世代輕鬆掌握命盤資訊，主動創造並探索自己的未來，延續古老智慧，同時融入現代潮流。

## ✨ 功能特色

- 🎯 **八字排盤計算** - 精確計算四柱八字、十神、納音
- ⚔️ **四時軍團系統** - 創新的角色化命盤呈現方式
- 🎖️ **神煞兵符系統** - 吉神凶煞的現代化詮釋
- 🎬 **打字機動畫效果** - 沉浸式的故事體驗
- 📱 **響應式設計** - 支持手機、平板、桌面設備
- 🌟 **賽博朋克風格** - 現代科技感的視覺設計

## 🚀 快速開始

### 本地運行

```bash
# 克隆倉庫
git clone https://github.com/momo741006/new-bazu.git
cd new-bazu

# 使用 Python 啟動本地服務器
python3 -m http.server 8000

# 或使用 Node.js
npx serve .

# 在瀏覽器中打開 http://localhost:8000
```

### 線上部署

支持多種部署方式：

- **GitHub Pages** - 推送到 main 分支自動部署
- **Netlify** - 連接倉庫一鍵部署
- **Vercel** - 零配置靜態網站部署

詳細部署指南請參考 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎮 使用說明

1. **輸入資料** - 填寫姓名、出生日期、時間等基本資訊
2. **查看八字** - 系統自動計算並顯示完整八字排盤
3. **探索軍團** - 體驗獨特的四時軍團系統分析

## 🛠️ 技術架構

- **前端**: 純 HTML5 + CSS3 + JavaScript ES6+
- **樣式**: 自定義 CSS，賽博朋克主題
- **動畫**: 原生 JavaScript 動畫效果
- **部署**: 靜態網站，無需後端服務器

## 📁 項目結構

```
new-bazu/
├── index.html          # 主頁面
├── style.css           # 樣式文件
├── app.js              # 主應用邏輯
├── army-effects.js     # 軍團特效系統
├── netlify.toml        # Netlify 部署配置
├── DEPLOYMENT.md       # 部署指南
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions 自動部署
```
