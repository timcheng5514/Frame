<script>
  import { getLogoDataUri } from '../utils/logos.js';

  let { 
    imageUrl = '', 
    exif = {}, 
    borderSize = 8, 
    bottomPadding = 12, 
    frameColor = '#FFFFFF', 
    textColor = '#2C2C2A', 
    innerBorder = true, 
    fontFamily = 'serif', 
    fontSizeScale = 1.0,
    fontWeight = '400',
    authorName = '', 
    showExif = true, 
    showLogo = true, 
    showLens = true, 
    showDate = true, 
    title = '', 
    styleMode = 'polaroid', // 'polaroid', 'hasselblad', 'pure', 'square'
    cropRatio = 'original'
  } = $props();

  let canvas = $state(null);
  let imageElement = $state(null);
  let logoImageElement = $state(null);
  let isDrawing = $state(false);

  // Load logo image reactively based on brand and textColor
  $effect(() => {
    if (showLogo && exif.brand && styleMode !== 'pure') {
      const dataUri = getLogoDataUri(exif.brand, textColor);
      const img = new Image();
      img.onload = () => {
        logoImageElement = img;
      };
      img.onerror = () => {
        console.error('Failed to load logo image:', exif.brand);
        logoImageElement = null;
      };
      img.src = dataUri;
    } else {
      logoImageElement = null;
    }
  });

  // Expose download method to the parent
  export function download(filename = 'framed-photo.jpg') {
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download failed:', e);
      alert('圖片下載失敗，可能是由於跨網域安全性限制。請嘗試上傳本地相片。');
    }
  }

  // Effect to load image when URL changes
  $effect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageElement = img;
      };
      img.src = imageUrl;
    } else {
      imageElement = null;
    }
  });

  // Reactive redraw effect triggered whenever variables change
  $effect(() => {
    // Collect dependencies
    const deps = {
      imageUrl,
      exif,
      borderSize,
      bottomPadding,
      frameColor,
      textColor,
      innerBorder,
      fontFamily,
      fontSizeScale,
      fontWeight,
      authorName,
      title,
      showExif,
      showLogo,
      showLens,
      showDate,
      styleMode,
      cropRatio,
      imageElement,
      logoImageElement
    };

    if (canvas && imageElement) {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          redraw();
        });
      } else {
        redraw();
      }
    }
  });

  function formatBrandLabel(brand) {
    if (!brand || brand === 'Camera') return '';
    return brand.toUpperCase().split('').join(' ');
  }

  function redraw() {
    if (!canvas || !imageElement) return;
    
    isDrawing = true;
    const ctx = canvas.getContext('2d');
    
    const imgW = imageElement.naturalWidth;
    const imgH = imageElement.naturalHeight;
    
    // Calculate source crop area based on cropRatio
    let sx = 0, sy = 0;
    let sw = imgW;
    let sh = imgH;
    
    if (cropRatio !== 'original') {
      let ratioVal = 1;
      if (cropRatio === '1:1') ratioVal = 1.0;
      else if (cropRatio === '4:3') ratioVal = 4 / 3;
      else if (cropRatio === '3:2') ratioVal = 3 / 2;
      else if (cropRatio === '16:9') ratioVal = 16 / 9;
      else if (cropRatio === '21:9') ratioVal = 21 / 9;
      else if (cropRatio === '2.7:1') ratioVal = 2.7;
      
      const isPortrait = imgH > imgW;
      const targetRatio = isPortrait ? (1 / ratioVal) : ratioVal;
      const origRatio = imgW / imgH;
      
      if (origRatio > targetRatio) {
        // Original is wider than target -> crop width (sides)
        sw = imgH * targetRatio;
        sh = imgH;
        sx = (imgW - sw) / 2;
        sy = 0;
      } else {
        // Original is taller than target -> crop height (top/bottom)
        sw = imgW;
        sh = imgW / targetRatio;
        sx = 0;
        sy = (imgH - sh) / 2;
      }
    }
    
    // Use the cropped photo dimensions for rendering and layout calculations
    const photoW = sw;
    const photoH = sh;
    const imgMin = Math.min(photoW, photoH);
    
    // Calculate borders based on percentage of shorter edge
    const margin = imgMin * (borderSize / 100);
    
    // Determine bottom margin based on style
    let bottomMargin = margin;
    if (styleMode === 'polaroid') {
      bottomMargin = imgMin * ((borderSize + bottomPadding) / 100);
    } else if (styleMode === 'hasselblad') {
      bottomMargin = imgMin * ((borderSize + bottomPadding * 0.75) / 100);
    }
    
    let canvasW, canvasH;
    let imgX, imgY;
    
    if (styleMode === 'square') {
      // Instagram style square aspect ratio
      const maxDim = Math.max(photoW, photoH);
      canvasW = maxDim + 2 * margin;
      canvasH = canvasW;
      
      imgX = (canvasW - photoW) / 2;
      // Offset vertically upwards if we have bottom metadata padding
      const textPadding = imgMin * (bottomPadding / 100);
      imgY = (canvasH - photoH) / 2 - (showExif ? textPadding / 2.5 : 0);
    } else {
      // Standard styles
      canvasW = photoW + 2 * margin;
      canvasH = photoH + margin + bottomMargin;
      imgX = margin;
      imgY = margin;
    }
    
    // Apply dimensions to canvas
    canvas.width = canvasW;
    canvas.height = canvasH;
    
    // 1. Draw Canvas background color
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    
    // 2. Draw the photo using cropped coordinates
    ctx.drawImage(imageElement, sx, sy, sw, sh, imgX, imgY, photoW, photoH);
    
    // 3. Draw thin inner borders around the image
    if (innerBorder) {
      ctx.strokeStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = Math.max(1, Math.round(imgMin * 0.0008)); // Scales with image size
      
      const gap = imgMin * 0.003; // Margin gap between image and border line
      ctx.strokeRect(
        imgX - gap,
        imgY - gap,
        photoW + 2 * gap,
        photoH + 2 * gap
      );
    }
    
    // 4. Draw EXIF Text details
    if (showExif && styleMode !== 'pure') {
      const scale = canvasW / 1000; // text scaler for resolution independence
      ctx.fillStyle = textColor;
      ctx.textBaseline = 'middle';
      
      // Determine font family (CSS variables are not supported by Canvas ctx.font)
      let fontName = "'Outfit', 'Noto Sans TC', system-ui, -apple-system, sans-serif";
      if (fontFamily === 'serif') fontName = "'Lora', 'Noto Serif TC', Georgia, serif";
      if (fontFamily === 'monospace') fontName = "ui-monospace, 'Courier New', monospace";
      
      if (styleMode === 'polaroid') {
        const textY = imgY + photoH + (bottomMargin - margin) / 2 + margin * 0.08;
        
        // Left details: Camera Model + Brand logo/text
        ctx.textAlign = 'left';
        let textOffset = 0;
        
        if (showLogo && logoImageElement) {
          const logoH = 22 * scale * fontSizeScale;
          const logoW = logoH * (logoImageElement.width / logoImageElement.height);
          // Draw logo aligned vertically with model text center
          ctx.drawImage(logoImageElement, imgX, textY - 10 * scale * fontSizeScale - logoH / 2, logoW, logoH);
          textOffset = logoW + 10 * scale;
        }
        
        ctx.font = `${fontWeight} ${22 * scale * fontSizeScale}px ${fontName}`;
        const modelText = exif.model || '';
        const brandText = (!showLogo || !logoImageElement) ? formatBrandLabel(exif.brand) : '';
        const mainLabel = brandText ? `${brandText}  ${modelText}` : modelText;
        ctx.fillText(mainLabel, imgX + textOffset, textY - 10 * scale * fontSizeScale);
        
        // Lens details (if enabled) - Align with Model text's left edge (with offset)
        if (showLens && exif.lens) {
          ctx.font = `300 ${14 * scale * fontSizeScale}px ${fontName}`;
          ctx.fillStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 42, 0.55)';
          ctx.fillText(exif.lens, imgX + textOffset, textY + 18 * scale * fontSizeScale);
        }
        
        // Right details: Shot parameters
        ctx.textAlign = 'right';
        ctx.fillStyle = textColor;
        ctx.font = `400 ${18 * scale * fontSizeScale}px ${fontName}`;
        
        let params = [];
        if (exif.focalLength) params.push(exif.focalLength);
        if (exif.aperture) params.push(exif.aperture);
        if (exif.shutter) params.push(exif.shutter);
        if (exif.iso) params.push(exif.iso);
        ctx.fillText(params.join('   '), imgX + photoW, textY - 10 * scale * fontSizeScale);
        
        // Date / Author metadata row
        let rightSubText = '';
        if (showDate && exif.date) rightSubText += exif.date;
        if (authorName) {
          if (rightSubText) rightSubText += '   |   ';
          rightSubText += authorName;
        }
        if (rightSubText) {
          ctx.font = `300 ${14 * scale * fontSizeScale}px ${fontName}`;
          ctx.fillStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 42, 0.55)';
          ctx.fillText(rightSubText, imgX + photoW, textY + 18 * scale * fontSizeScale);
        }
        
        // Title (Centered)
        if (title) {
          ctx.textAlign = 'center';
          ctx.fillStyle = textColor;
          ctx.font = `italic 300 ${18 * scale * fontSizeScale}px ${fontName}`;
          ctx.fillText(title, canvasW / 2, textY + 4 * scale * fontSizeScale);
        }
        
      } else if (styleMode === 'hasselblad') {
        const textY = imgY + photoH + bottomMargin / 2 + margin * 0.12;
        
        // Small top border separating photo from technical parameters
        ctx.strokeStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = Math.max(1.5, Math.round(scale * 0.75));
        ctx.beginPath();
        ctx.moveTo(imgX, imgY + photoH + margin * 0.25);
        ctx.lineTo(imgX + photoW, imgY + photoH + margin * 0.25);
        ctx.stroke();
        
        // Left: Camera Brand & Model
        ctx.textAlign = 'left';
        let textOffset = 0;
        
        if (showLogo && logoImageElement) {
          const logoH = 16 * scale * fontSizeScale;
          const logoW = logoH * (logoImageElement.width / logoImageElement.height);
          ctx.drawImage(logoImageElement, imgX, textY - logoH / 2, logoW, logoH);
          textOffset = logoW + 8 * scale;
        }
        
        ctx.font = `${fontWeight} ${16 * scale * fontSizeScale}px ${fontName}`;
        const brandText = (!showLogo || !logoImageElement) ? (exif.brand || '').toUpperCase() : '';
        const modelText = exif.model || '';
        const lensText = showLens && exif.lens ? `  /  ${exif.lens}` : '';
        ctx.fillText(`${brandText} ${modelText}${lensText}`, imgX + textOffset, textY);
        
        // Right: Parameters with bullets
        ctx.textAlign = 'right';
        ctx.font = `500 ${16 * scale * fontSizeScale}px ${fontName}`;
        let params = [];
        if (exif.focalLength) params.push(exif.focalLength);
        if (exif.aperture) params.push(exif.aperture);
        if (exif.shutter) params.push(exif.shutter);
        if (exif.iso) params.push(exif.iso);
        ctx.fillText(params.join('  •  '), imgX + photoW, textY);
        
        // Center: Author name, date, title
        ctx.textAlign = 'center';
        ctx.font = `300 ${14 * scale * fontSizeScale}px ${fontName}`;
        ctx.fillStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(44, 44, 42, 0.6)';
        
        let centerText = '';
        if (authorName) centerText += authorName;
        if (showDate && exif.date) {
          if (centerText) centerText += '  •  ';
          centerText += exif.date;
        }
        if (title) {
          if (centerText) centerText += '  —  ';
          centerText += `"${title}"`;
        }
        ctx.fillText(centerText, canvasW / 2, textY);
        
      } else if (styleMode === 'square') {
        const textY = canvasH - margin - (bottomPadding * imgMin / 100) / 2;
        ctx.textAlign = 'center';
        
        let currentY = textY;
        
        // 1. Brand Logo (Centered on its own line)
        if (showLogo && logoImageElement) {
          const logoH = 22 * scale * fontSizeScale;
          const logoW = logoH * (logoImageElement.width / logoImageElement.height);
          const logoX = (canvasW - logoW) / 2;
          ctx.drawImage(logoImageElement, logoX, currentY - 26 * scale * fontSizeScale - logoH / 2, logoW, logoH);
          currentY += 8 * scale * fontSizeScale;
        }
        
        // 2. Brand & Model (Centered)
        ctx.font = `${fontWeight} ${22 * scale * fontSizeScale}px ${fontName}`;
        const modelText = exif.model || '';
        const brandText = (!showLogo || !logoImageElement) ? formatBrandLabel(exif.brand) + ' ' : '';
        ctx.fillText(`${brandText}${modelText}`, canvasW / 2, currentY - 20 * scale * fontSizeScale);
        
        let nextY = currentY;
        
        // 3. Lens model row (Centered)
        if (showLens && exif.lens) {
          ctx.font = `300 ${15 * scale * fontSizeScale}px ${fontName}`;
          ctx.fillStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 42, 0.55)';
          ctx.fillText(exif.lens, canvasW / 2, currentY + 4 * scale * fontSizeScale);
          nextY += 22 * scale * fontSizeScale;
        } else {
          nextY += 4 * scale * fontSizeScale;
        }
        
        // 4. Parameters (Centered)
        ctx.font = `400 ${18 * scale * fontSizeScale}px ${fontName}`;
        ctx.fillStyle = textColor;
        let params = [];
        if (exif.focalLength) params.push(exif.focalLength);
        if (exif.aperture) params.push(exif.aperture);
        if (exif.shutter) params.push(exif.shutter);
        if (exif.iso) params.push(exif.iso);
        ctx.fillText(params.join('   |   '), canvasW / 2, nextY + 18 * scale * fontSizeScale);
        
        // 5. Author, date, caption (Centered)
        let subDetails = [];
        if (authorName) subDetails.push(authorName);
        if (showDate && exif.date) subDetails.push(exif.date);
        if (title) subDetails.push(`"${title}"`);
        
        if (subDetails.length > 0) {
          ctx.font = `300 ${13 * scale * fontSizeScale}px ${fontName}`;
          ctx.fillStyle = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(44, 44, 42, 0.45)';
          ctx.fillText(subDetails.join('   •   '), canvasW / 2, nextY + 40 * scale * fontSizeScale);
        }
      }
    }
    isDrawing = false;
  }
</script>

<div class="canvas-wrapper" style="background-color: {frameColor === '#FFFFFF' ? '#F2EFE9' : '#121212'}; border: 1px solid var(--border-color);">
  <canvas bind:this={canvas} class="framed-canvas"></canvas>
</div>

<style>
  .canvas-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 90%;
    padding: 16px;
    border-radius: 4px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }

  .framed-canvas {
    max-width: 100%;
    max-height: 70vh;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    background-color: #FFFFFF;
    transition: box-shadow 0.3s ease;
  }
</style>
