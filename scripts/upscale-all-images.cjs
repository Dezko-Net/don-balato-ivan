const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const REALESRGAN_BIN = 'C:\\Proyectos\\PROJECT DISEÑADOR IA (PRODUCCION) - 14-06-2026 (300MB)\\tools\\realesrgan\\realesrgan-ncnn-vulkan.exe';
const MODELS_PATH = 'C:\\Proyectos\\PROJECT DISEÑADOR IA (PRODUCCION) - 14-06-2026 (300MB)\\tools\\realesrgan\\models';

const inputDir = path.join(process.cwd(), 'excels', 'imagenes-cortadas');
const outputDir = path.join(process.cwd(), 'excels', 'imagenes-hd');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => /\.(jpg|jpeg|png|webp|bmp)$/i.test(f));
console.log(`Total imagenes a procesar: ${files.length}`);
console.log(`Modelo: realesrgan-x4plus | Scale: 2x\n`);

let done = 0;
let failed = 0;
const errors = [];

function upscaleOne(file) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(inputDir, file);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(outputDir, `${baseName}.png`);

    const args = [
      '-i', inputPath,
      '-o', outputPath,
      '-s', '2',
      '-n', 'realesrgan-x4plus',
      '-m', MODELS_PATH,
      '-f', 'png'
    ];

    execFile(REALESRGAN_BIN, args, {
      maxBuffer: 50 * 1024 * 1024,
      windowsHide: true
    }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${file}: ${error.message}`));
        return;
      }
      resolve(outputPath);
    });
  });
}

async function main() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      await upscaleOne(file);
      done++;
      if (done % 10 === 0) console.log(`Procesadas: ${done}/${files.length}`);
    } catch (e) {
      failed++;
      errors.push(e.message);
      console.error(`Error: ${e.message}`);
    }
  }

  console.log(`\nTotal: ${done} procesadas, ${failed} errores`);
  console.log(`Guardadas en: ${outputDir}`);
  if (errors.length > 0) {
    console.log('\nErrores:');
    errors.forEach(e => console.log(`  ${e}`));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
