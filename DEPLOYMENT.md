# 部署指南 - Deployment Guide

虹靈御所 - 八字人生兵法網站部署說明

## 部署選項 / Deployment Options

### 1. GitHub Pages (推薦)

1. 在 GitHub 倉庫中啟用 GitHub Pages
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"
   - 系統會自動使用 `.github/workflows/deploy.yml` 進行部署

2. 推送代碼到 `main` 分支會自動觸發部署
3. 網站將在 `https://[用戶名].github.io/new-bazu` 上線

### 2. Netlify

1. 登錄 [Netlify](https://netlify.com)
2. 連接 GitHub 倉庫
3. 設置構建設置：
   - Build command: `echo 'Static site ready'`
   - Publish directory: `.`
4. 系統會自動使用 `netlify.toml` 配置

### 3. Vercel

1. 登錄 [Vercel](https://vercel.com)
2. 導入 GitHub 倉庫
3. 系統會自動檢測靜態網站並部署

### 4. 本地部署 / Local Deployment

```bash
# 使用 Python 服務器
python3 -m http.server 8000

# 使用 Node.js 服務器
npx serve .

# 使用 PHP 服務器
php -S localhost:8000
```

## 網站功能 / Features

- ✅ 響應式設計，支持手機和桌面
- ✅ 八字排盤計算
- ✅ 四時軍團系統
- ✅ 神煞系統分析
- ✅ 打字機效果動畫
- ✅ 粒子背景效果

## 技術要求 / Requirements

- 無需服務器端處理
- 純靜態 HTML/CSS/JavaScript
- 支持所有現代瀏覽器
- 無需數據庫

## 故障排除 / Troubleshooting

如果遇到問題：

1. 檢查瀏覽器控制台是否有 JavaScript 錯誤
2. 確保所有文件路徑正確
3. 驗證 HTTP 服務器正確提供靜態文件

## 自定義 / Customization

要修改網站：

1. 編輯 `style.css` 來改變外觀
2. 編輯 `app.js` 來修改功能
3. 編輯 `index.html` 來改變結構
4. 修改 `army-effects.js` 來調整動畫效果