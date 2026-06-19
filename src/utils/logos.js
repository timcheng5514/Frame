// Clean minimalist SVG logo templates for camera brands
// We use currentColor inside the SVG so we can dynamically replace it with the frame's text color.

const LOGOS = {
  leica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="15" fill="#E02424"/>
    <text x="16" y="19" font-family="'Georgia', 'Times New Roman', serif" font-style="italic" font-weight="bold" font-size="10.5" fill="#FFFFFF" text-anchor="middle">Leica</text>
  </svg>`,

  sony: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 20" width="80" height="20">
    <text x="50%" y="65%" font-family="'Georgia', 'Times New Roman', serif" font-weight="bold" font-size="15" fill="currentColor" text-anchor="middle" letter-spacing="1">S O N Y</text>
  </svg>`,

  canon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 20" width="80" height="20">
    <text x="50%" y="65%" font-family="'Georgia', 'Times New Roman', serif" font-style="italic" font-weight="bold" font-size="16" fill="currentColor" text-anchor="middle">Canon</text>
  </svg>`,

  nikon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 20" width="80" height="20">
    <text x="50%" y="65%" font-family="system-ui, -apple-system, sans-serif" font-style="italic" font-weight="900" font-size="15" fill="currentColor" text-anchor="middle" letter-spacing="0.5">Nikon</text>
  </svg>`,

  fujifilm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" width="100" height="20">
    <text x="50%" y="65%" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="12.5" fill="currentColor" text-anchor="middle" letter-spacing="1.5">FUJIFILM</text>
  </svg>`,

  hasselblad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M9 8v8h1.5v-3h3v3h1.5V8H13.5v3.5h-3V8H9z" fill="currentColor"/>
  </svg>`,

  apple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.57 2.94-1.39z"/>
  </svg>`,

  dji: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 20" width="80" height="20">
    <text x="50%" y="65%" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="currentColor" text-anchor="middle" letter-spacing="1">DJI</text>
  </svg>`,

  camera: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>`
};

/**
 * Gets a colored SVG data URI for a brand
 * @param {string} brand 
 * @param {string} color 
 * @returns {string} Data URI string
 */
export function getLogoDataUri(brand, color) {
  const key = brand ? brand.toLowerCase().trim() : 'camera';
  let svg = LOGOS[key];
  
  if (!svg) {
    // If brand not found, check partial matches
    if (key.includes('sony')) svg = LOGOS.sony;
    else if (key.includes('canon')) svg = LOGOS.canon;
    else if (key.includes('nikon')) svg = LOGOS.nikon;
    else if (key.includes('fuji')) svg = LOGOS.fujifilm;
    else if (key.includes('leica')) svg = LOGOS.leica;
    else if (key.includes('hassel')) svg = LOGOS.hasselblad;
    else if (key.includes('apple')) svg = LOGOS.apple;
    else if (key.includes('dji')) svg = LOGOS.dji;
    else svg = LOGOS.camera;
  }
  
  // Replace currentColor with actual CSS color
  const coloredSvg = svg.replace(/currentColor/g, color);
  
  // Return encoded data URI
  return `data:image/svg+xml;utf8,${encodeURIComponent(coloredSvg)}`;
}
