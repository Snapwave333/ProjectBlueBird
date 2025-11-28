const fs = require('fs');
const path = require('path');

function writeLocal(walletAddress) {
  const p = path.resolve(process.cwd(), 'scripts/dev-users.json');
  const existing = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  existing[walletAddress] = { role: 'developer' };
  fs.writeFileSync(p, JSON.stringify(existing, null, 2));
  console.log(`Developer role set for ${walletAddress}`);
}

async function main() {
  const wallet = process.env.DEVELOPER_WALLET || '4LSYehuDEqA26yzMDEGWxAYK2u2QFhfFbnJFi4LKy6dU';
  writeLocal(wallet);
}

main().catch((e) => { console.error(e); process.exit(1); });
