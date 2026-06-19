/**
 * Parses a .cube LUT file text content.
 * Returns { size, data, name }
 */
export function parseCubeLUT(text, filename = 'Custom LUT') {
  const lines = text.split('\n');
  let size = 0;
  const dataPoints = [];
  let min = [0, 0, 0];
  let max = [1, 1, 1];

  for (let line of lines) {
    // Remove comments and whitespace
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    // Handle comments at end of line
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }

    const parts = line.split(/\s+/);
    if (parts[0] === 'LUT_3D_SIZE') {
      size = parseInt(parts[1], 10);
    } else if (parts[0] === 'DOMAIN_MIN') {
      min = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
    } else if (parts[0] === 'DOMAIN_MAX') {
      max = [parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])];
    } else if (parts.length === 3 && !isNaN(parseFloat(parts[0]))) {
      dataPoints.push(
        parseFloat(parts[0]),
        parseFloat(parts[1]),
        parseFloat(parts[2])
      );
    }
  }

  if (size === 0) {
    throw new Error('LUT_3D_SIZE not found in file');
  }

  if (dataPoints.length !== size * size * size * 3) {
    throw new Error(`LUT data size mismatch. Expected ${size * size * size} points, got ${dataPoints.length / 3}`);
  }

  const data = new Float32Array(dataPoints);

  // Remove file extension for name
  const name = filename.replace(/\.[^/.]+$/, "");

  return { size, data, min, max, name };
}

/**
 * Applies a 3D LUT, Exposure, Saturation, and Film Grain adjustments to ImageData.
 */
export function applyLUT(imageData, lut, intensity = 1.0, exposure = 0.0, saturation = 0.0, noise = 0.0) {
  const pixels = imageData.data;
  const len = pixels.length;
  
  const hasExposure = exposure !== 0.0;
  const hasSaturation = saturation !== 0.0;
  const hasLut = lut !== null && lut !== undefined;
  const hasNoise = noise > 0.0;
  
  if (!hasExposure && !hasSaturation && !hasLut && !hasNoise) return;
  
  // Precompute exposure factor
  const exposureFactor = Math.pow(2, exposure);
  
  // Precompute saturation factor
  const satFactor = 1.0 + saturation / 100.0;
  
  // Precompute film grain factor
  const noiseFactor = (noise / 100.0) * 45.0; // max noise offset of 45 (approx 18% variance)
  
  // Precompute LUT parameters
  let lutData = null;
  let S = 0;
  let S2 = 0;
  let factor = 0;
  let S_minus_1 = 0;
  if (hasLut) {
    lutData = lut.data;
    S = lut.size;
    S2 = S * S;
    factor = (S - 1) / 255.0;
    S_minus_1 = S - 1;
  }

  for (let i = 0; i < len; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];

    // 1. Exposure adjustment (applied in float space)
    if (hasExposure) {
      r = r * exposureFactor;
      g = g * exposureFactor;
      b = b * exposureFactor;
    }

    // 2. Saturation adjustment
    if (hasSaturation) {
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;
    }

    // Clamp values before LUT lookup
    if (r < 0) r = 0; else if (r > 255) r = 255;
    if (g < 0) g = 0; else if (g > 255) g = 255;
    if (b < 0) b = 0; else if (b > 255) b = 255;

    // 3. LUT application
    if (hasLut) {
      const x = r * factor;
      const y = g * factor;
      const z = b * factor;

      const x0 = x | 0;
      const x1 = x0 < S_minus_1 ? x0 + 1 : x0;
      const y0 = y | 0;
      const y1 = y0 < S_minus_1 ? y0 + 1 : y0;
      const z0 = z | 0;
      const z1 = z0 < S_minus_1 ? z0 + 1 : z0;

      const fx = x - x0;
      const fy = y - y0;
      const fz = z - z0;

      const z0_S2 = z0 * S2;
      const z1_S2 = z1 * S2;
      const y0_S = y0 * S;
      const y1_S = y1 * S;

      const idx000 = (z0_S2 + y0_S + x0) * 3;
      const idx001 = (z1_S2 + y0_S + x0) * 3;
      const idx010 = (z0_S2 + y1_S + x0) * 3;
      const idx011 = (z1_S2 + y1_S + x0) * 3;
      const idx100 = (z0_S2 + y0_S + x1) * 3;
      const idx101 = (z1_S2 + y0_S + x1) * 3;
      const idx110 = (z0_S2 + y1_S + x1) * 3;
      const idx111 = (z1_S2 + y1_S + x1) * 3;

      const r00 = lutData[idx000] * (1.0 - fz) + lutData[idx001] * fz;
      const r01 = lutData[idx010] * (1.0 - fz) + lutData[idx011] * fz;
      const r10 = lutData[idx100] * (1.0 - fz) + lutData[idx101] * fz;
      const r11 = lutData[idx110] * (1.0 - fz) + lutData[idx111] * fz;
      const r0 = r00 * (1.0 - fy) + r01 * fy;
      const r1 = r10 * (1.0 - fy) + r11 * fy;
      const targetR = (r0 * (1.0 - fx) + r1 * fx) * 255.0;

      const g00 = lutData[idx000 + 1] * (1.0 - fz) + lutData[idx001 + 1] * fz;
      const g01 = lutData[idx010 + 1] * (1.0 - fz) + lutData[idx011 + 1] * fz;
      const g10 = lutData[idx100 + 1] * (1.0 - fz) + lutData[idx101 + 1] * fz;
      const g11 = lutData[idx110 + 1] * (1.0 - fz) + lutData[idx111 + 1] * fz;
      const g0 = g00 * (1.0 - fy) + g01 * fy;
      const g1 = g10 * (1.0 - fy) + g11 * fy;
      const targetG = (g0 * (1.0 - fx) + g1 * fx) * 255.0;

      const b00 = lutData[idx000 + 2] * (1.0 - fz) + lutData[idx001 + 2] * fz;
      const b01 = lutData[idx010 + 2] * (1.0 - fz) + lutData[idx011 + 2] * fz;
      const b10 = lutData[idx100 + 2] * (1.0 - fz) + lutData[idx101 + 2] * fz;
      const b11 = lutData[idx110 + 2] * (1.0 - fz) + lutData[idx111 + 2] * fz;
      const b0 = b00 * (1.0 - fy) + b01 * fy;
      const b1 = b10 * (1.0 - fy) + b11 * fy;
      const targetB = (b0 * (1.0 - fx) + b1 * fx) * 255.0;

      if (intensity === 1.0) {
        r = targetR;
        g = targetG;
        b = targetB;
      } else {
        r = r * (1.0 - intensity) + targetR * intensity;
        g = g * (1.0 - intensity) + targetG * intensity;
        b = b * (1.0 - intensity) + targetB * intensity;
      }
    }

    // 4. Monochromatic film grain noise addition (post-LUT)
    if (hasNoise) {
      const offset = (Math.random() - 0.5) * noiseFactor;
      r += offset;
      g += offset;
      b += offset;
    }

    // Final clamping
    if (r < 0) r = 0; else if (r > 255) r = 255;
    if (g < 0) g = 0; else if (g > 255) g = 255;
    if (b < 0) b = 0; else if (b > 255) b = 255;

    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
}
