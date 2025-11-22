import { sendC } from '../examples/sendC';

export async function main() {
  const to = process.argv[2];
  const amount = process.argv[3] || '0.0001';
  if (!to) {
    console.error('Usage: ts-node src/cli/sendC.ts <to> [amount]');
    process.exit(1);
  }
  await sendC(to, amount);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
