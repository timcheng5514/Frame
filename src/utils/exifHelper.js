import EXIF from './exif-patched.js';

/**
 * Parses a File object and extracts EXIF metadata in a clean format.
 * @param {File} file
 * @returns {Promise<Object>} Formatted EXIF parameters
 */
export function getPhotoExif(file) {
  return new Promise((resolve) => {
    const defaultExif = {
      brand: 'Camera',
      model: 'Model',
      lens: '',
      shutter: '',
      aperture: '',
      focalLength: '',
      focal35: '',
      iso: '',
      date: ''
    };

    if (!file) {
      resolve(defaultExif);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target.result;
        // Parse the binary array buffer directly
        const allTags = EXIF.readFromBinaryFile(arrayBuffer);
        
        console.log('--- EXIF Debugger ---');
        console.log('檔案名稱 (File Name):', file.name);
        console.log('檔案類型 (File Type):', file.type || '未指定 MimeType');
        console.log('讀取到的 EXIF 原始標記 (Parsed EXIF Tags):', allTags);
        console.log('---------------------');

        if (!allTags) {
          console.warn('該相片檔案中未包含可讀取的 EXIF 二進位區塊。');
          resolve(defaultExif);
          return;
        }
        
        const brand = cleanBrandName(allTags.Make);
        const model = cleanModelName(allTags.Model, brand);
        
        const shutter = formatShutterSpeed(allTags.ExposureTime);
        const aperture = formatAperture(allTags.FNumber);
        const focalLength = formatFocalLength(allTags.FocalLength);
        const focal35 = allTags.FocalLengthIn35mmFilm || allTags.FocalLengthIn35mmFormat ? `${allTags.FocalLengthIn35mmFilm || allTags.FocalLengthIn35mmFormat}mm` : '';
        
        let iso = allTags.ISOSpeedRatings;
        if (Array.isArray(iso)) iso = iso[0];
        if (!iso && allTags.ISO) iso = allTags.ISO;
        
        const lens = cleanLensName(allTags.LensModel || allTags.LensInfo || allTags.Lens);
        const date = formatDate(allTags.DateTimeOriginal || allTags.DateTime);

        resolve({
          brand: brand || 'Camera',
          model: model || 'Model',
          lens: lens || '',
          shutter: shutter || '',
          aperture: aperture || '',
          focalLength: focalLength || '',
          focal35: focal35 || '',
          iso: iso ? `ISO ${iso}` : '',
          date: date || '',
          raw: allTags
        });
      } catch (err) {
        console.error('Error parsing EXIF binary:', err);
        resolve(defaultExif);
      }
    };
    
    reader.onerror = function() {
      console.error('Failed to read file as ArrayBuffer');
      resolve(defaultExif);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function cleanBrandName(brand) {
  if (!brand) return '';
  const b = brand.toLowerCase().trim();
  if (b.includes('sony')) return 'Sony';
  if (b.includes('canon')) return 'Canon';
  if (b.includes('nikon')) return 'Nikon';
  if (b.includes('fuji')) return 'Fujifilm';
  if (b.includes('leica')) return 'Leica';
  if (b.includes('apple')) return 'Apple';
  if (b.includes('ricoh')) return 'Ricoh';
  if (b.includes('panasonic')) return 'Panasonic';
  if (b.includes('olympus')) return 'Olympus';
  if (b.includes('hasselblad')) return 'Hasselblad';
  if (b.includes('sigma')) return 'Sigma';
  if (b.includes('dji')) return 'DJI';
  
  // Capitalize first letter as fallback
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

function cleanModelName(model, brand) {
  if (!model) return '';
  let m = model.trim();
  
  // Remove brand prefix if camera model starts with it (e.g. "Fujifilm X-T4" -> "X-T4")
  if (brand && m.toLowerCase().startsWith(brand.toLowerCase())) {
    m = m.slice(brand.length).trim();
  }
  
  // Specific model cleaning for aesthetics
  if (m === 'ILCE-7RM4') return 'A7R IV';
  if (m === 'ILCE-7RM3') return 'A7R III';
  if (m === 'ILCE-7M3') return 'A7 III';
  if (m === 'ILCE-7M4') return 'A7 IV';
  if (m === 'ILCE-7C') return 'A7C';
  if (m === 'ILCE-7CR') return 'A7CR';
  if (m === 'ILCE-7CM2') return 'A7C II';
  if (m === 'ILCE-6700') return 'A6700';
  
  return m;
}

function cleanLensName(lens) {
  if (!lens) return '';
  let l = lens.trim();
  // Remove common verbose lens descriptions
  l = l.replace(/f\/[0-9\.]+\-[0-9\.]+/gi, ''); // remove aperture range
  l = l.replace(/F[0-9\.]+\-[0-9\.]+/gi, '');
  l = l.replace(/\s+/g, ' '); // collapse spaces
  return l.trim();
}

function formatShutterSpeed(val) {
  if (!val) return '';
  if (typeof val === 'object' && val.numerator && val.denominator) {
    // If it's a fraction object
    const num = val.numerator;
    const den = val.denominator;
    if (num === 1) return `1/${den}s`;
    if (num > 1) {
      // simplify if possible
      const gcd = (a, b) => b ? gcd(b, a % b) : a;
      const divisor = gcd(num, den);
      const cleanNum = num / divisor;
      const cleanDen = den / divisor;
      if (cleanDen === 1) return `${cleanNum}s`;
      return `${cleanNum}/${cleanDen}s`;
    }
    // decimal value fallback
    const dec = num / den;
    return dec >= 1 ? `${dec.toFixed(1).replace(/\.0$/, '')}s` : `1/${Math.round(1/dec)}s`;
  }

  const num = Number(val);
  if (isNaN(num)) return val.toString();
  if (num >= 1) {
    return `${num.toFixed(1).replace(/\.0$/, '')}s`;
  }
  const denominator = Math.round(1 / num);
  return `1/${denominator}s`;
}

function formatAperture(val) {
  if (!val) return '';
  if (typeof val === 'object' && val.numerator && val.denominator) {
    return `f/${(val.numerator / val.denominator).toFixed(1).replace(/\.0$/, '')}`;
  }
  const num = Number(val);
  if (isNaN(num)) return `f/${val}`;
  return `f/${num.toFixed(1).replace(/\.0$/, '')}`;
}

function formatFocalLength(val) {
  if (!val) return '';
  if (typeof val === 'object' && val.numerator && val.denominator) {
    return `${Math.round(val.numerator / val.denominator)}mm`;
  }
  const num = Number(val);
  if (isNaN(num)) return `${val}mm`;
  return `${Math.round(num)}mm`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Input form is usually "YYYY:MM:DD HH:MM:SS" or similar
  const parts = dateStr.split(' ');
  const datePart = parts[0];
  if (datePart && datePart.includes(':')) {
    return datePart.replace(/:/g, '.');
  }
  return dateStr;
}
