const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match `<Link href={`/productos/...` or `<Link href="/productos/...`
  const regex1 = /<Link\s+href=\{`\/productos\//g;
  const regex2 = /<Link\s+href="\/productos\//g;
  
  let newContent = content;
  newContent = newContent.replace(regex1, '<Link prefetch={false} href={`/productos/');
  newContent = newContent.replace(regex2, '<Link prefetch={false} href="/productos/');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated:', file);
    changedCount++;
  }
});

console.log(`Done. Updated ${changedCount} files.`);
