import client from '@/models/client';
import { Task } from '@/models';

async function main() {
  const result = await Task.updateMany(
    { status: { $nin: ['BACKLOG', 'DONE'] } },
    { $set: { status: 'BACKLOG' } },
  );
  console.log(`Migrated ${result.modifiedCount} task(s) to BACKLOG`);
  await client.close();
}

void main();
