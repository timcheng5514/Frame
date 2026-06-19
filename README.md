# 框景 / Minimal Frame

[English](#english-version) | [繁體中文版](#繁體中文版)

---

## English Version
### This app was made by Antigravity, so... yeah... if you met any issues or bugs, just send some PR or post at issue.

### Introduction
**Minimal Frame (框景)** is a modern, elegant web-based tool designed to add minimalist, Polaroid-style, and Hasselblad-style borders to your photographs. It automatically reads EXIF metadata (camera brand, model, lens, aperture, shutter speed, ISO, and shooting date) directly from your photos, creating a beautiful border layout ready for sharing.

### Key Features
- 📷 **Auto EXIF Extraction**: Automatically extracts metadata using `exif-js` upon uploading.
- 🎨 **Multiple Layout Styles**:
  - **Polaroid Style**: Classic gallery frame with signature, description, and key EXIF data.
  - **Hasselblad Style**: Vintage medium format look with technical specs separated by bullets and border dividers.
  - **1:1 Social Square**: Optimizes the aspect ratio to a perfect square for platforms like Instagram.
  - **Pure Minimalist Border**: Clear and simple margins without text.
- ⚙️ **Highly Customizable Controls**:
  - Photo aspect ratio cropping (presets like 1:1, 4:3, 3:2, 16:9, 21:9, and 2.7:1 with auto orientation detection).
  - Border thickness and bottom padding (percentage-based scaling to preserve quality).
  - Optional inner thin border surrounding the photo.
  - 4 elegant color presets (朝靄白 / Mist White, 暖沙黃 / Warm Sand, 雨燕灰 / Swift Gray, 玄武黑 / Basalt Black) or custom selections.
  - Typography options: Curated preset fonts (Lora / Noto Serif, Outfit / Noto Sans, Monospace, Playfair Display, Cormorant Garamond, Cinzel, Montserrat, Inter, Caveat, Alex Brush), adjustable font weights, and text size scale.
  - Custom font loading: Upload local font files (.ttf, .otf, .woff, .woff2) to apply custom typography.
  - LUT Color Filter: Upload standard .cube LUT files to color-grade the photo itself (without affecting the borders or EXIF text) with adjustable intensity.
- 🖋️ **Custom Titles & Signatures**: Add custom titles (e.g., location/story) and author signatures (e.g., photographer name).
- ✏️ **Manual EXIF Editor**: Ability to manually input or modify EXIF parameters (great for scanned film or messaging apps that strip metadata).
- 💾 **High-Resolution Export**: Renders to an HTML5 Canvas matching the image's original dimensions and exports as a high-quality `.jpg`.

### Tech Stack
- **Framework**: [Svelte 5](https://svelte.dev/) (built with the latest Runes syntax for efficient reactive state management)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Libraries**: [exif-js](https://github.com/exif-js/exif-js)
- **Styling**: Vanilla CSS for responsive and elegant dark/light theme customization

### Getting Started

#### Prerequisites
- Node.js (v18 or higher recommended)
- npm (or yarn / pnpm)

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/timcheng5514/frame.git
   cd frame
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

#### Run Locally
Launch the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Production Build
Build the optimized application bundle:
```bash
npm run build
```
Preview the built app locally:
```bash
npm run preview
```

### Project Structure
```
├── public/          # Static assets (favicons, etc.)
├── src/
│   ├── assets/      # Images, icons, or global assets
│   ├── lib/         # Svelte components
│   │   ├── ImageUploader.svelte # Drag-and-drop file uploader
│   │   ├── PreviewCanvas.svelte # HTML5 Canvas rendering logic
│   │   ├── Sidebar.svelte       # Configuration controls & parameters
│   │   └── ... (UI control widgets like Select, Toggle, Slider)
│   ├── utils/       # Utility helper functions
│   │   └── logos.js # Brand SVG logos (Leica, Hasselblad, Sony, etc.)
│   ├── App.svelte   # Main page layout & state orchestration
│   ├── app.css      # Core design system and CSS styling
│   └── main.js      # App entry point
├── package.json
└── vite.config.js
```

---

## 繁體中文版

### 本專案是由 Antigravity 寫的所以...，你發現任何問題或 bug，歡迎提出 issue 或 Pull Request，謝謝你的支持！

### 專案簡介
**框景 (Minimal Frame)** 是一款現代且優雅的網頁版相片加框工具。它能自動從您上傳的相片中讀取 EXIF 元數據（如相機品牌、型號、鏡頭、光圈、快門、ISO 及拍攝日期），並結合拍立得風格（Polaroid）、哈蘇底片風格（Hasselblad）等美學樣式，為您的相片量身打造精緻的極簡邊框。(為什麼他自己要叫框景啊我很好奇)

### 核心功能
- 📷 **自動提取 EXIF 資訊**：上傳照片時自動解析並帶入相機型號、拍攝參數及時間。
- 🎨 **多樣化邊框樣式**：
  - **畫廊相框 (Polaroid)**：經典的下寬邊相框，附帶相機型號、鏡頭資訊、拍攝參數與簽名。
  - **哈蘇底片 (Classic)**：復古且精準的底片風格，使用細實線分割，以圓點分隔技術參數。
  - **社群正方形 (1:1)**：專為 Instagram 等社群平台設計的完美 1:1 正方形畫幅。
  - **極簡純邊框**：無任何文字資訊，僅保留照片周圍純淨的白色或彩色邊框。
- ⚙️ **高度自訂調整**：
  - 相片比例快速裁切（支援 1:1、4:3、3:2、16:9、21:9、2.7:1 等比例，自動適配橫/直幅相片）。
  - 邊框寬度及下方文字區高度（以比例計算，適配各種相片解析度）。
  - 可選擇是否開啟相片周圍的「細內邊框」。
  - 提供 4 種精心調配的經典配色預設（朝靄白、暖沙黃、雨燕灰、玄武黑）以及文字/邊框自訂色彩。
  - 字體樣式支援：精心調配的經典預設字體（Lora / Noto Serif, Outfit / Noto Sans, Playfair Display, Cormorant Garamond, Cinzel, Montserrat, Inter, 還有 Caveat 與 Alex Brush 手寫簽名體），並可自由調整字重與縮放大小。
  - 自訂字體功能：支援直接上傳本地端字體檔案（.ttf, .otf, .woff, .woff2）套用。
  - 相片色彩濾鏡 (LUT)：支援上傳標準的 .cube 濾鏡檔案，獨立為相片本體進行風格調色（不影響相框與 EXIF 文字），並可自由調整套用強度。
- 🖋️ **客製化文字標題與簽名**：自由加入相片標題（如景點名稱）與作者簽名（如 Photo by Alex）。
- ✏️ **EXIF 手動自訂/修正**：若相片無 EXIF 資訊（如掃描膠卷、老相機、或被通訊軟體壓縮過），可透過側邊欄隨時手動填寫、修改或補齊參數。
- 💾 **高解析度匯出**：使用 HTML5 Canvas 依據照片原始尺寸進行渲染，匯出無失真、高品質的 `.jpg` 圖像。

### 技術棧
- **前端框架**：[Svelte 5](https://svelte.dev/)（全面採用最新的 Runes 響應式語法 `$state`、`$props`、`$bindable`、`$effect`）
- **建構工具**：[Vite](https://vitejs.dev/)
- **核心依賴**：[exif-js](https://github.com/exif-js/exif-js)
- **樣式設計**：Vanilla CSS（具備完整的響應式版面與深色/淺色主題支持）

### 開始使用

#### 前置需求
- Node.js (推薦 v18 或以上版本)
- npm (或 yarn / pnpm)

#### 安裝步驟
1. 複製本專案庫：
   ```bash
   git clone https://github.com/timcheng5514/frame.git
   cd frame
   ```
2. 安裝專案依賴：
   ```bash
   npm install
   ```

#### 本地開發
啟動本地開發伺服器：
```bash
npm run dev
```
啟動後在瀏覽器中打開 [http://localhost:5173](http://localhost:5173)。

#### 專案打包
建構用於生產環境的靜態資源檔案：
```bash
npm run build
```
在本地預覽生產環境建構出的版本：
```bash
npm run preview
```

### 專案結構說明
```
├── public/          # 靜態資源 (如 favicon 等)
├── src/
│   ├── assets/      # 圖片、圖標或全域靜態資源
│   ├── lib/         # Svelte 元件
│   │   ├── ImageUploader.svelte # 拖曳/點擊上傳圖片元件
│   │   ├── PreviewCanvas.svelte # HTML5 Canvas 核心繪製邏輯
│   │   ├── Sidebar.svelte       # 設定控制側邊欄（主要操作介面）
│   │   └── ... (其他 UI 微型控制項如 Select、Toggle、Slider)
│   ├── utils/       # 工具函式
│   │   └── logos.js # 各大相機品牌 SVG 標誌 (Leica, Hasselblad, Sony 等)
│   ├── App.svelte   # 應用程式主入口與狀態調度
│   ├── app.css      # 設計系統核心與 CSS 樣式
│   └── main.js      # 程式進入點
├── package.json
└── vite.config.js
```
