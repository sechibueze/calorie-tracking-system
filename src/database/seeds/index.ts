import { disconnectDB, db } from '@/database/db';
import { seedRbac } from './rbac.seed';

async function main(): Promise<void> {
  await seedRbac(db);
  // eslint-disable-next-line no-console
  console.log('Seeded roles and permissions');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
  })
  .finally(disconnectDB);