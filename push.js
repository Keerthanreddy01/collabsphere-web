const { execSync } = require('child_process');

function run(cmd) {
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: __dirname });
  } catch (err) {
    console.error(`Error executing ${cmd}`);
  }
}

// Wait for a small delay between pushes if needed
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function doPushes() {
  // Push 1
  run('git add frontend/app/globals.css frontend/app/layout.tsx');
  run('git commit -m "chore: enable global smooth scroll and setup"');
  run('git push');
  await sleep(1000);

  // Push 2
  run('git add frontend/app/collabsphere-theme.css');
  run('git commit -m "feat: implement collabsphere adaptive grid theme"');
  run('git push');
  await sleep(1000);

  // Push 3
  run('git add frontend/components/landing/collabsphere/collabsphere-context.tsx frontend/components/landing/collabsphere/collabsphere-shared.tsx');
  run('git commit -m "feat: add landing context and shared assets"');
  run('git push');
  await sleep(1000);

  // Push 4
  run('git add frontend/components/landing/collabsphere/page-loader.tsx');
  run('git commit -m "feat: add custom page loader with scroll lock"');
  run('git push');
  await sleep(1000);

  // Push 5
  run('git add frontend/components/landing/collabsphere/collabsphere-header.tsx');
  run('git commit -m "feat: implement sticky navigation header"');
  run('git push');
  await sleep(1000);

  // Push 6
  run('git add frontend/components/landing/collabsphere/liquid-reveal.tsx');
  run('git commit -m "feat: create liquid reveal canvas component"');
  run('git push');
  await sleep(1000);

  // Push 7
  run('git add frontend/components/landing/collabsphere/collabsphere-hero.tsx');
  run('git commit -m "feat: assemble collabsphere hero section"');
  run('git push');
  await sleep(1000);

  // Push 8
  run('git add frontend/components/landing/collabsphere/collabsphere-about.tsx frontend/components/landing/collabsphere/collabsphere-bands-and-portfolio.tsx');
  run('git commit -m "feat: add about and portfolio grid sections"');
  run('git push');
  await sleep(1000);

  // Push 9
  run('git add frontend/components/landing/collabsphere/collabsphere-services-and-stats.tsx');
  run('git commit -m "feat: integrate services hover rows and stats"');
  run('git push');
  await sleep(1000);

  // Push 10
  run('git add frontend/components/landing/collabsphere/collabsphere-overlays.tsx frontend/components/landing/landing-experience.tsx');
  run('git commit -m "feat: finalize overlays and mount landing experience"');
  run('git push');

  console.log('All 10 pushes completed!');
}

doPushes();
