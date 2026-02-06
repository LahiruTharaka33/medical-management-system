import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'donl.dl1997@gmail.com' },
    update: {},
    create: {
      email: 'donl.dl1997@gmail.com',
      name: 'User',
      password,
    },
  });
  console.log({ user });

  const adminPassword = await bcrypt.hash('Password', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@med' },
    update: {},
    create: {
      email: 'admin@med',
      name: 'Admin User',
      password: adminPassword,
    },
  });
  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
