import { disconnectDB, db } from '@/database/db';
import { seedRbac } from './rbac.seed';
import { SEED_USERS, seedUsers } from './users.seed';
import { seedEntries } from './entries.seed';

async function main(): Promise<void> {
  await seedRbac(db);
  await seedUsers(db);
  await seedEntries(db)
  /* eslint-disable no-console */
  console.log('Seeded roles, permissions and users. Demo tokens:');
  for (const u of SEED_USERS) console.log(`  ${u.role.padEnd(5)} ${u.email.padEnd(20)}`);
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