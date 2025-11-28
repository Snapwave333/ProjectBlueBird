const fs = require('fs');
const path = require('path');
const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

async function loadOrCreateKeypair(filePath) {
  if (fs.existsSync(filePath)) {
    const secret = Uint8Array.from(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    return Keypair.fromSecretKey(secret);
  }
  const kp = Keypair.generate();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(Array.from(kp.secretKey)));
  return kp;
}

async function main() {
  const payerPath = path.resolve(process.cwd(), '.keys/devnet-payer.json');
  const outPath = path.resolve(process.cwd(), 'scripts/last-mint.json');
  const connection = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'), 'confirmed');
  const payer = await loadOrCreateKeypair(payerPath);

  const airdropSig = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSig, 'confirmed');

  const mint = await createMint(connection, payer, payer.publicKey, null, 9);
  const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
  await mintTo(connection, payer, mint, ata.address, payer.publicKey, BigInt(1_000_000_000_000));

  const result = {
    mint: mint.toBase58(),
    payer: payer.publicKey.toBase58(),
    payerAta: ata.address.toBase58(),
    decimals: 9
  };
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
