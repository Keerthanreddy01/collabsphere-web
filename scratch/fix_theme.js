const fs = require('fs');
const file = 'frontend/app/dashboard/home/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  [/bg-\[\#0a0a0a\]/g, 'bg-white dark:bg-[#0a0a0a]'],
  [/bg-\[\#121212\]/g, 'bg-gray-50 dark:bg-[#121212]'],
  [/bg-neutral-950\/80/g, 'bg-gray-100/80 dark:bg-neutral-950/80'],
  [/bg-\[\#0A0A0A\]/g, 'bg-white dark:bg-[#0A0A0A]'],
  [/bg-\[\#111111\]/g, 'bg-gray-50 dark:bg-[#111111]'],
  [/(?<!dark:)text-white/g, 'text-black dark:text-white'],
  [/(?<!dark:)text-neutral-400/g, 'text-gray-500 dark:text-neutral-400'],
  [/(?<!dark:)text-neutral-300/g, 'text-gray-600 dark:text-neutral-300'],
  [/(?<!dark:)text-neutral-500/g, 'text-gray-400 dark:text-neutral-500'],
  [/(?<!dark:)border-white\/(?:\[?[0-9\.]+\]?|[0-9]+)/g, (match) => 'border-gray-200 dark:' + match],
  [/(?<!dark:)border-\[\#222222\]/g, 'border-gray-300 dark:border-[#222222]'],
  [/(?<!dark:)bg-white\/5/g, 'bg-black/5 dark:bg-white/5'],
  [/(?<!dark:)hover:bg-white\/5/g, 'hover:bg-black/5 dark:hover:bg-white/5'],
  [/(?<!dark:)hover:bg-white\/10/g, 'hover:bg-black/10 dark:hover:bg-white/10'],
];

replacements.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

// Clean up some bad replacements
content = content.replace(/text-black dark:text-black dark:text-white/g, 'text-black dark:text-white');
content = content.replace(/dark:dark:/g, 'dark:');

fs.writeFileSync(file, content);
