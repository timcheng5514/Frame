<script>
  import ImageUploader from "./lib/ImageUploader.svelte";
  import PreviewCanvas from "./lib/PreviewCanvas.svelte";
  import Sidebar from "./lib/Sidebar.svelte";

  // Core image state
  let imageUrl = $state("");
  let imageFile = $state(null);

  let exif = $state({
    brand: "Camera",
    model: "Model",
    lens: "",
    shutter: "",
    aperture: "",
    focalLength: "",
    focal35: "",
    iso: "",
    date: "",
  });

  // Config parameters
  let styleMode = $state("polaroid");
  let borderSize = $state(8);
  let bottomPadding = $state(12);
  let frameColor = $state("#FFFFFF");
  let textColor = $state("#2C2C2A");
  let innerBorder = $state(true);
  let fontFamily = $state("serif");
  let fontSizeScale = $state(1.0);
  let fontWeight = $state("400");
  let authorName = $state("");
  let title = $state("");
  let showExif = $state(true);
  let showLogo = $state(true);
  let showLens = $state(true);
  let showDate = $state(true);

  // Reference to Canvas instance
  let canvasRef = $state(null);

  function handleImageLoaded(data) {
    imageUrl = data.url;
    imageFile = data.file;
    exif = data.exif;

    // Set some smart defaults based on the image's short edge aspect if needed
    borderSize = 7;
    bottomPadding = styleMode === "hasselblad" ? 6 : 10;
  }

  function handleDownload() {
    if (canvasRef) {
      const origName = imageFile
        ? imageFile.name.substring(0, imageFile.name.lastIndexOf("."))
        : "framed-photo";
      const downloadName = `${origName}-framed.jpg`;
      canvasRef.download(downloadName);
    }
  }

  function handleReset() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    imageUrl = "";
    imageFile = null;
    exif = {
      brand: "Camera",
      model: "Model",
      lens: "",
      shutter: "",
      aperture: "",
      focalLength: "",
      focal35: "",
      iso: "",
      date: "",
    };
    authorName = "";
    title = "";
  }
</script>

<header>
  <div class="logo-section">
    <h1>
      框景 <span>/ Minimal Frame</span> <span class="logo-badge">日系簡約</span>
    </h1>
  </div>
  <div class="header-links">
    <a
      href="https://github.com/timcheng5514/frame"
      target="_blank"
      rel="noreferrer"
      class="github-link"
      title="GitHub"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
        />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    </a>
  </div>
</header>

<main class="main-container">
  <div class="preview-area">
    {#if imageUrl}
      <PreviewCanvas
        bind:this={canvasRef}
        {imageUrl}
        {exif}
        {borderSize}
        {bottomPadding}
        {frameColor}
        {textColor}
        {innerBorder}
        {fontFamily}
        {fontSizeScale}
        {fontWeight}
        {authorName}
        {title}
        {showExif}
        {showLogo}
        {showLens}
        {showDate}
        {styleMode}
      />
    {:else}
      <div class="empty-state">
        <ImageUploader onimage={handleImageLoaded} />
      </div>
    {/if}
  </div>

  <aside class="sidebar">
    <Sidebar
      bind:styleMode
      bind:borderSize
      bind:bottomPadding
      bind:frameColor
      bind:textColor
      bind:innerBorder
      bind:fontFamily
      bind:fontSizeScale
      bind:fontWeight
      bind:authorName
      bind:title
      bind:showExif
      bind:showLogo
      bind:showLens
      bind:showDate
      bind:exif
      hasImage={!!imageUrl}
      onDownload={handleDownload}
      onReset={handleReset}
    />
  </aside>
</main>

<style>
  .github-link {
    color: var(--text-secondary);
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
  }
  .github-link:hover {
    color: var(--text-primary);
  }
</style>
