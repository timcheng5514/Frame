<script>
  import Slider from './Slider.svelte';
  import Toggle from './Toggle.svelte';
  import Select from './Select.svelte';
  import Button from './Button.svelte';

  let {
    styleMode = $bindable('polaroid'),
    borderSize = $bindable(8),
    bottomPadding = $bindable(12),
    frameColor = $bindable('#FFFFFF'),
    textColor = $bindable('#2C2C2A'),
    innerBorder = $bindable(true),
    fontFamily = $bindable('serif'),
    fontSizeScale = $bindable(1.0),
    fontWeight = $bindable('400'),
    authorName = $bindable(''),
    title = $bindable(''),
    showExif = $bindable(true),
    showLogo = $bindable(true),
    showLens = $bindable(true),
    showDate = $bindable(true),
    exif = $bindable({}),
    cropRatio = $bindable('original'),
    hasImage = false,
    onDownload,
    onReset
  } = $props();

  const stylesList = [
    { value: 'polaroid', label: '畫廊相框 (Polaroid)' },
    { value: 'hasselblad', label: '哈蘇底片 (Classic)' },
    { value: 'square', label: '社群正方形 (1:1)' },
    { value: 'pure', label: '極簡純邊框' }
  ];

  const cropsList = [
    { value: 'original', label: '原始比例 (Original)' },
    { value: '1:1', label: '1:1 正方形' },
    { value: '4:3', label: '4:3 傳統' },
    { value: '3:2', label: '3:2 經典底片' },
    { value: '16:9', label: '16:9 寬螢幕' },
    { value: '21:9', label: '21:9 電影寬幅' },
    { value: '2.7:1', label: '2.7:1 寬銀幕 (Ultra)' }
  ];

  const defaultFonts = [
    { value: 'serif', label: '優雅襯線體 (Lora / Noto Serif)' },
    { value: 'sans-serif', label: '簡約無襯線 (Outfit / Noto Sans)' },
    { value: 'monospace', label: '復古等寬體 (Monospace)' },
    
    // Curated Google Fonts
    { value: "'Playfair Display', 'Noto Serif TC', serif", label: '華麗展示 serif (Playfair Display)' },
    { value: "'Cormorant Garamond', 'Noto Serif TC', serif", label: '古典加拉蒙 serif (Cormorant Garamond)' },
    { value: "'Cinzel', 'Noto Serif TC', serif", label: '羅馬古典面 serif (Cinzel)' },
    { value: "'Montserrat', 'Noto Sans TC', sans-serif", label: '幾何現代 sans (Montserrat)' },
    { value: "'Inter', 'Noto Sans TC', sans-serif", label: '極致簡約 sans (Inter)' },
    { value: "'Caveat', cursive", label: '手寫簽名體 cursive (Caveat)' },
    { value: "'Alex Brush', cursive", label: '流暢草書體 cursive (Alex Brush)' }
  ];

  let customFonts = $state([]);
  let fontsList = $derived([...defaultFonts, ...customFonts]);

  let fontError = $state('');

  async function handleLocalFontUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          // Extract base font name without extension
          const fontName = file.name.substring(0, file.name.lastIndexOf('.'));
          
          // Create and register FontFace
          const fontFace = new FontFace(fontName, buffer);
          const loadedFace = await fontFace.load();
          document.fonts.add(loadedFace);

          // Add to customFonts list reactively
          const fontValue = `"${fontName}"`;
          
          // Check if already in list
          if (!customFonts.some(f => f.value === fontValue)) {
            customFonts = [...customFonts, {
              value: fontValue,
              label: `本地: ${fontName}`
            }];
          }

          // Auto-select
          fontFamily = fontValue;
          fontError = '';
        } catch (err) {
          console.error(err);
          fontError = '字體檔案解析失敗，請確認檔案格式是否正確。';
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      fontError = '讀取字體檔案失敗';
    }
  }

  const weightsList = [
    { value: '300', label: '細體 (Light 300)' },
    { value: '400', label: '標準 (Regular 400)' },
    { value: '500', label: '中黑 (Medium 500)' },
    { value: '700', label: '粗體 (Bold 700)' }
  ];

  const colorPresets = [
    { name: '朝靄白', frame: '#FFFFFF', text: '#2C2C2A' },
    { name: '暖沙黃', frame: '#F5F2EA', text: '#3A3832' },
    { name: '雨燕灰', frame: '#EBEBE8', text: '#2E2D2A' },
    { name: '玄武黑', frame: '#1A1A1A', text: '#FAF9F5' }
  ];

  // Helper state to show/hide manual override panel
  let showOverride = $state(false);

  function applyPreset(preset) {
    frameColor = preset.frame;
    textColor = preset.text;
  }
</script>

<div class="sidebar-content">
  <!-- Layout Options -->
  <div>
    <h3 class="section-title">版面配置</h3>
    <div class="control-group">
      <Select label="相框樣式" options={stylesList} bind:value={styleMode} />
    </div>

    <div class="control-group" style="margin-top: 16px;">
      <Select label="相片裁切" options={cropsList} bind:value={cropRatio} />
    </div>
    
    <div class="control-group" style="margin-top: 16px;">
      <Slider label="邊框寬度" min={2} max={18} step={0.5} suffix="%" bind:value={borderSize} />
    </div>

    {#if styleMode !== 'pure'}
      <div class="control-group" style="margin-top: 16px;">
        <Slider label="下方文字區高度" min={4} max={25} step={0.5} suffix="%" bind:value={bottomPadding} />
      </div>
    {/if}
  </div>

  <!-- Color Presets & Typography -->
  <div>
    <h3 class="section-title">色彩與字體</h3>
    <div class="control-group">
      <span class="control-label">相框配色預設</span>
      <div class="color-preset-container">
        {#each colorPresets as preset}
          <button 
            type="button"
            class="preset-btn"
            style="background-color: {preset.frame}; border: 1px solid {preset.frame === '#FFFFFF' ? 'var(--border-color)' : 'transparent'}"
            onclick={() => applyPreset(preset)}
            title={preset.name}
          >
            <span class="preset-dot" style="background-color: {preset.text}"></span>
          </button>
        {/each}
      </div>
    </div>

    {#if styleMode !== 'pure'}
      <div class="control-group" style="margin-top: 16px;">
        <Select label="字體樣式" options={fontsList} bind:value={fontFamily} />
      </div>

      <!-- Local Font Upload Control -->
      <div class="custom-font-box" style="margin-top: 12px; padding: 10px;">
        <div class="local-font-row">
          <label class="file-upload-label">
            <span>上傳自訂字體檔案 (.ttf, .otf, .woff, .woff2)</span>
            <input 
              type="file" 
              accept=".ttf,.otf,.woff,.woff2" 
              onchange={handleLocalFontUpload}
              style="display: none;"
            />
          </label>
        </div>
        {#if fontError}
          <div class="font-error-msg" style="margin-top: 6px;">{fontError}</div>
        {/if}
      </div>

      <div class="control-group" style="margin-top: 16px;">
        <Select label="字體粗細" options={weightsList} bind:value={fontWeight} />
      </div>

      <div class="control-group" style="margin-top: 16px;">
        <Slider label="文字大小" min={0.6} max={2.5} step={0.05} suffix="x" bind:value={fontSizeScale} />
      </div>
    {/if}
  </div>

  <!-- Content Customization -->
  {#if styleMode !== 'pure'}
    <div>
      <h3 class="section-title">文字與顯示內容</h3>
      <div class="toggle-group">
        <Toggle label="啟用相框文字" bind:checked={showExif} />
        
        {#if showExif}
          <Toggle label="照片細邊框" bind:checked={innerBorder} />
          <Toggle label="顯示相機品牌" bind:checked={showLogo} />
          <Toggle label="顯示鏡頭型號" bind:checked={showLens} />
          <Toggle label="顯示拍攝日期" bind:checked={showDate} />
          
          <div class="control-group" style="margin-top: 12px;">
            <label class="control-label" for="author-input">作者簽名 (Author)</label>
            <input 
              type="text" 
              id="author-input" 
              placeholder="e.g. PHOTO BY ALEX" 
              bind:value={authorName} 
            />
          </div>

          <div class="control-group" style="margin-top: 12px;">
            <label class="control-label" for="title-input">照片標題 (Title)</label>
            <input 
              type="text" 
              id="title-input" 
              placeholder="e.g. Kyoto, Japan" 
              bind:value={title} 
            />
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div>
      <h3 class="section-title">顯示設定</h3>
      <div class="toggle-group">
        <Toggle label="照片細邊框" bind:checked={innerBorder} />
      </div>
    </div>
  {/if}

  <!-- Manual EXIF Overrides (only if we have an image and showing text) -->
  {#if hasImage && showExif && styleMode !== 'pure'}
    <div>
      <button 
        type="button" 
        class="override-toggle-btn"
        onclick={() => showOverride = !showOverride}
      >
        <span>自訂 EXIF 參數</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          style="transform: rotate({showOverride ? 180 : 0}deg); transition: transform 0.2s;"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {#if showOverride}
        <div class="override-panel">
          <div class="override-grid">
            <div class="field-item">
              <label for="over-brand">品牌</label>
              <input type="text" id="over-brand" bind:value={exif.brand} />
            </div>
            <div class="field-item">
              <label for="over-model">相機型號</label>
              <input type="text" id="over-model" bind:value={exif.model} />
            </div>
            <div class="field-item full-width">
              <label for="over-lens">鏡頭型號</label>
              <input type="text" id="over-lens" bind:value={exif.lens} />
            </div>
            <div class="field-item">
              <label for="over-focal">焦段</label>
              <input type="text" id="over-focal" placeholder="50mm" bind:value={exif.focalLength} />
            </div>
            <div class="field-item">
              <label for="over-aperture">光圈</label>
              <input type="text" id="over-aperture" placeholder="f/2.8" bind:value={exif.aperture} />
            </div>
            <div class="field-item">
              <label for="over-shutter">快門</label>
              <input type="text" id="over-shutter" placeholder="1/125s" bind:value={exif.shutter} />
            </div>
            <div class="field-item">
              <label for="over-iso">ISO</label>
              <input type="text" id="over-iso" placeholder="ISO 100" bind:value={exif.iso} />
            </div>
            <div class="field-item full-width">
              <label for="over-date">日期</label>
              <input type="text" id="over-date" bind:value={exif.date} />
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Sticky Bottom Buttons -->
<div class="sidebar-footer">
  <Button variant="primary" onclick={onDownload} disabled={!hasImage}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
    下載高解析度照片
  </Button>
  
  {#if hasImage}
    <Button variant="danger" onclick={onReset}>
      清除相片
    </Button>
  {/if}
</div>

<style>
  .color-preset-container {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .preset-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
  }

  .preset-btn:hover {
    transform: scale(1.15);
  }

  .preset-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: block;
  }

  .toggle-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .override-toggle-btn {
    width: 100%;
    background: none;
    border: none;
    border-top: 1px dashed var(--border-color);
    padding: 16px 0 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    outline: none;
  }

  .override-toggle-btn:hover {
    color: var(--text-primary);
  }

  .override-panel {
    margin-top: 16px;
    background-color: var(--bg-primary);
    border-radius: 4px;
    padding: 16px;
    border: 1px solid var(--border-color);
  }

  .override-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .field-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-item.full-width {
    grid-column: span 2;
  }

  .field-item label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .field-item input {
    font-size: 0.75rem;
    padding: 6px 10px;
    background-color: var(--bg-card);
  }

  /* Custom Font adder styles */
  .custom-font-box {
    margin-top: 8px;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .local-font-row {
    display: flex;
    flex-direction: column;
  }

  .file-upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--border-color);
    background-color: var(--bg-card);
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
  }

  .file-upload-label:hover {
    border-color: var(--accent-color);
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }

  .font-error-msg {
    font-size: 0.7rem;
    color: var(--danger-color);
    margin-top: 6px;
  }
</style>
