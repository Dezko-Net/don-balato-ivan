const fs = require('fs');
const path = require('path');
const Module = require('module');

const originalScriptPath = 'C:\\Proyectos\\PROJECT CLONNER (PRODUCCION) - 14-06-2026 (1.2GB)\\shopify-folla.js';
const projectRoot = path.resolve(__dirname, '..');
const publicOut = path.join(projectRoot, 'public', 'shopify').replace(/\\/g, '/');
const templatesOut = path.join(projectRoot, 'src', 'templates').replace(/\\/g, '/');

let source = fs.readFileSync(originalScriptPath, 'utf8');

source = source.replace(
  /const YAXSEL_PUBLIC = path\.resolve\('C:\/Proyectos\/PROJECT YAXSEL\/web-store\/public\/shopify'\);/,
  `const YAXSEL_PUBLIC = path.resolve('${publicOut}');`
);

source = source.replace(
  /const YAXSEL_TEMPLATES = path\.resolve\('C:\/Proyectos\/PROJECT YAXSEL\/web-store\/src\/templates'\);/,
  `const YAXSEL_TEMPLATES = path.resolve('${templatesOut}');`
);

const originalArgv = process.argv.slice();
process.argv = ['node', originalScriptPath, ...process.argv.slice(2)];

const mod = new Module(originalScriptPath, module.parent);
mod.filename = originalScriptPath;
mod.paths = Module._nodeModulePaths(path.dirname(originalScriptPath));
mod._compile(source, originalScriptPath);

process.argv = originalArgv;
