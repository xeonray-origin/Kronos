import client from '@/models/client';
import { Task } from '@/models';

async function main() {
  const result = await Task.updateMany(
    { timeSpentSeconds: { $exists: false } },
    { $set: { timeSpentSeconds: 0 } },
  );
  console.log(`Migrated ${result.modifiedCount} task(s) to timeSpentSeconds 0`);
  await client.close();
}

void main();
