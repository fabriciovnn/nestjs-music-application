import { PrismaClient, Role } from '../generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.user.create({
      data: {
        name: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Usuário admin criado com sucesso!');
  } else {
    console.log('ℹ️ Usuário admin já existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
