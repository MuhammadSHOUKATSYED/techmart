import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function loadJSON(filename: string) {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Keep only fields defined in the Prisma schema
function sanitizeTransaction(t: any) {
  return {
    customer_id: Number(t.customer_id),
    product_id: Number(t.product_id),
    quantity: Number(t.quantity),
    price: Number(t.total_amount ?? t.unit_price ?? 0),
    timestamp: new Date(t.timestamp),
    status: t.status,
    payment_method: t.payment_method,
  };
}

function isValidTransaction(t: any): boolean {
  return (
    Number.isInteger(+t.customer_id) &&
    Number.isInteger(+t.product_id) &&
    Number.isInteger(+t.quantity) &&
    !isNaN(parseFloat(t.total_amount ?? t.unit_price)) &&
    !isNaN(Date.parse(t.timestamp)) &&
    typeof t.status === 'string' &&
    typeof t.payment_method === 'string'
  );
}

async function main() {
  const transactions = await loadJSON('transactions.json');

  const validTransactions = transactions
    .filter(isValidTransaction)
    .map(sanitizeTransaction);

  console.log(`⏳ Seeding ${validTransactions.length} valid transactions out of ${transactions.length}...`);

  if (validTransactions.length > 0) {
    await prisma.transaction.createMany({
      data: validTransactions,
      skipDuplicates: true,
    });
    console.log('✅ Transactions seeded successfully!');
  } else {
    console.log('⚠️ No valid transactions found to seed.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding transactions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
