const fs = require('fs');
const path = require('path');

const NEW_DESKTOP_BANNER = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784934268608-pegada-1784934265286.png';

function updateDesktopBannerInFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Reemplazar la imagen <img src="..."> y su srcset de la portada 1 (preservando el <source media="(max-width: 767px)"> de móvil)
  // Buscamos el tag <img ...> dentro de la primera picture del slideshow
  const imgRegex = /(<source\s+media="\(max-width:\s*767px\)"[^>]*>\s*)(<img\s+src=")[^"]+("[\s\S]*?srcset=")[^"]+(")/i;

  if (imgRegex.test(content)) {
    content = content.replace(imgRegex, (match, p1, p2, p3, p4) => {
      // Reemplazamos todos los srcset de desktop por la nueva URL
      const newSrcset = `${NEW_DESKTOP_BANNER} 300w, ${NEW_DESKTOP_BANNER} 400w, ${NEW_DESKTOP_BANNER} 500w, ${NEW_DESKTOP_BANNER} 600w, ${NEW_DESKTOP_BANNER} 700w, ${NEW_DESKTOP_BANNER} 800w, ${NEW_DESKTOP_BANNER} 900w, ${NEW_DESKTOP_BANNER} 1000w, ${NEW_DESKTOP_BANNER} 1200w, ${NEW_DESKTOP_BANNER} 1400w, ${NEW_DESKTOP_BANNER} 1600w, ${NEW_DESKTOP_BANNER} 1800w, ${NEW_DESKTOP_BANNER} 2000w, ${NEW_DESKTOP_BANNER} 2200w`;
      return `${p1}${p2}${NEW_DESKTOP_BANNER}${p3}${newSrcset}${p4}`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Portada de PC/Escritorio actualizada con éxito en ${filePath}`);
  }
}

function run() {
  console.log('🚀 Actualizando la portada principal de PC / Escritorio...');

  updateDesktopBannerInFile(path.join(__dirname, '../public/shopify/plantilla25/body-clean.html'));
  updateDesktopBannerInFile(path.join(__dirname, '../public/shopify/plantilla25/index.html'));

  console.log('🎉 PORTADA PC/ESCRITORIO ACTUALIZADA CON ÉXITO.');
}

run();
