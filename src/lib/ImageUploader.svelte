<script>
  import { getPhotoExif } from "../utils/exifHelper.js";

  let { onimage } = $props();

  let isDragging = $state(false);
  let errorMsg = $state("");

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      errorMsg = "請選擇圖片格式檔案 (*.jpg, *.png, *.webp, 等)";
      return;
    }
    errorMsg = "";

    try {
      const exif = await getPhotoExif(file);
      const url = URL.createObjectURL(file);
      onimage({ file, url, exif });
    } catch (err) {
      console.error(err);
      const url = URL.createObjectURL(file);
      onimage({
        file,
        url,
        exif: {
          brand: "Camera",
          model: "Unknown Model",
          lens: "",
          shutter: "",
          aperture: "",
          focalLength: "",
          focal35: "",
          iso: "",
          date: "",
        },
      });
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function onDragLeave() {
    isDragging = false;
  }

  function onDrop(e) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function onFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  async function loadSampleImage(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch("/kyoto_street.png");
      const blob = await response.blob();
      const file = new File([blob], "kyoto-street.png", { type: "image/png" });
      const url = URL.createObjectURL(file);
      const mockExif = {
        brand: "Fujifilm",
        model: "X-T5",
        lens: "XF 35mm F1.4 R",
        shutter: "1/125s",
        aperture: "f/1.4",
        focalLength: "35mm",
        focal35: "53mm",
        iso: "ISO 400",
        date: "2026.06.19 18:30:00",
      };
      onimage({ file, url, exif: mockExif });
    } catch (err) {
      console.error("Failed to load sample image:", err);
    }
  }
</script>

<div
  class="upload-zone {isDragging ? 'dragging' : ''}"
  role="region"
  aria-label="圖片上傳區"
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <input
    type="file"
    id="file-input"
    accept="image/*"
    onchange={onFileChange}
    class="file-input"
  />
  <label for="file-input" class="upload-label">
    <div class="upload-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </div>
    <span class="upload-text">點擊選取或拖曳相片至此處</span>
    <span class="upload-subtext"
      >支援 JPEG, PNG, WebP 等，並自動讀取 EXIF 拍攝參數</span
    >

    <div class="sample-btn-container" style="margin-top: 8px; z-index: 10;">
      <button
        type="button"
        style="display: none;"
        class="sample-btn"
        onclick={loadSampleImage}
      >
        使用範例相片測試
      </button>
    </div>
  </label>

  {#if errorMsg}
    <p class="error-msg">{errorMsg}</p>
  {/if}
</div>

<style>
  .upload-zone {
    border: 1px dashed var(--border-color);
    background-color: var(--bg-card);
    border-radius: 6px;
    padding: 56px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }

  .upload-zone:hover,
  .upload-zone.dragging {
    border-color: var(--text-secondary);
    background-color: var(--bg-hover);
  }

  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }

  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    cursor: pointer;
  }

  .upload-icon {
    color: var(--text-light);
    transition: color 0.2s ease;
  }

  .upload-zone:hover .upload-icon {
    color: var(--text-primary);
  }

  .upload-text {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: 0.05em;
  }

  .upload-subtext {
    font-size: 0.75rem;
    color: var(--text-light);
    max-width: 320px;
    line-height: 1.5;
  }

  .error-msg {
    margin-top: 16px;
    font-size: 0.8rem;
    color: var(--danger-color);
  }

  .sample-btn {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    font-family: var(--font-sans);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sample-btn:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--text-light);
  }
</style>
