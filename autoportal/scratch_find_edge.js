const fs = require('fs');
const path = require('path');

function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      scan(p);
    } else if (/\.(ts|tsx|js)$/.test(f.name)) {
      const c = fs.readFileSync(p, 'utf8');
      if (/runtime\s*=\s*['"]edge['"]/.test(c)) {
        console.log('EDGE_ROUTE:', p);
      }
    }
  }
}

scan('e:/autofyon fof VSCode/autoportal/src/app');
