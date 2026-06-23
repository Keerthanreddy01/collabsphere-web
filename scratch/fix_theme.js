const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const files = [
  ...getFiles('frontend/app'),
  ...getFiles('frontend/components')
];

const replacements = [
  // Backgrounds
  [/bg-\[\#0a0a0a\]/g, 'bg-white dark:bg-[#0a0a0a]'],
  [/bg-\[\#121212\]/g, 'bg-gray-50 dark:bg-[#121212]'],
  [/bg-neutral-950\/80/g, 'bg-gray-100/80 dark:bg-neutral-950/80'],
  [/bg-\[\#0A0A0A\]/g, 'bg-white dark:bg-[#0A0A0A]'],
  [/bg-\[\#111111\]/g, 'bg-gray-50 dark:bg-[#111111]'],
  [/bg-\[\#111\]/g, 'bg-gray-100 dark:bg-[#111]'],
  [/bg-\[\#050505\]/g, 'bg-white dark:bg-[#050505]'],
  [/bg-black/g, 'bg-white dark:bg-black'],
  
  // Texts
  [/(?<!dark:)text-white/g, 'text-black dark:text-white'],
  [/(?<!dark:)text-black/g, 'text-white dark:text-black'], // Be careful with this one, maybe skip it? Actually let's remove it
  [/(?<!dark:)text-neutral-400/g, 'text-gray-500 dark:text-neutral-400'],
  [/(?<!dark:)text-neutral-300/g, 'text-gray-600 dark:text-neutral-300'],
  [/(?<!dark:)text-neutral-500/g, 'text-gray-400 dark:text-neutral-500'],
  
  // Borders
  [/(?<!dark:)border-white\/(?:\[?[0-9\.]+\]?|[0-9]+)/g, (match) => 'border-gray-200 dark:' + match],
  [/(?<!dark:)border-\[\#222222\]/g, 'border-gray-300 dark:border-[#222222]'],
  
  // Hovers and Opacities
  [/(?<!dark:)bg-white\/5/g, 'bg-black/5 dark:bg-white/5'],
  [/(?<!dark:)bg-white\/10/g, 'bg-black/10 dark:bg-white/10'],
  [/(?<!dark:)bg-white\/20/g, 'bg-black/20 dark:bg-white/20'],
  [/(?<!dark:)hover:bg-white\/5/g, 'hover:bg-black/5 dark:hover:bg-white/5'],
  [/(?<!dark:)hover:bg-white\/10/g, 'hover:bg-black/10 dark:hover:bg-white/10'],
  [/(?<!dark:)border-white/g, 'border-black/20 dark:border-white'],
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  replacements.forEach(([regex, replacement]) => {
    newContent = newContent.replace(regex, replacement);
  });

  // Clean up duplicate text-black dark:text-white dark:text-white
  newContent = newContent.replace(/text-black dark:text-black dark:text-white/g, 'text-black dark:text-white');
  newContent = newContent.replace(/bg-white dark:bg-white dark:bg-black/g, 'bg-white dark:bg-black');
  newContent = newContent.replace(/dark:dark:/g, 'dark:');
  newContent = newContent.replace(/text-white dark:text-black dark:text-white/g, 'text-black dark:text-white');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
