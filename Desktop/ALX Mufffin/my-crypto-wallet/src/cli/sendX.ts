import { sendX } from '../examples/sendX';

export async function main() {
  const to = process.argv[2];
  const amount = Number(process.argv[3] || process.env.TEST_X_AMOUNT || '1000000');
  if (!to) {
    console.error('Usage: ts-node src/cli/sendX.ts <X-address> [amountNAvax]');
    process.exit(1);
  }
  await sendX(to, amount);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
