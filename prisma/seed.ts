import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  const users = [
    { name: 'Igor Mendes',    email: 'igor.mendes@example.com' },
    { name: 'Carlos Pereira', email: 'carlos.pereira@example.com' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email }, // email é unique => idempotente
      update: {},
      create: u,
    });
    console.log(`User ok: ${u.name} <${u.email}>`);
  }
}

async function seedBooks() {
  type B = { title: string; author: string; publishedYear: number };
  const books: B[] = [
    { title: "Harry Potter", author: 'J.K. Rowling',    publishedYear: 1997 },
    { title: 'O Hobbit',     author: 'J.R.R. Tolkien',  publishedYear: 1937 },
    { title: '1984',         author: 'George Orwell',   publishedYear: 1949 },
  ];

  for (const b of books) {
    // Book não tem unique no schema. Para ficar idempotente, verificamos por título+autor+ano.
    const exists = await prisma.book.findFirst({
      where: {
        title: b.title,
        author: b.author,
        publishedYear: b.publishedYear,
      },
      select: { id: true },
    });

    if (exists) {
      console.log(`Book ok: ${b.title} — ${b.author} (${b.publishedYear})`);
      continue;
    }

    await prisma.book.create({ data: b }); // status = AVAILABLE por default
    console.log(`Book criado: ${b.title} — ${b.author} (${b.publishedYear})`);
  }
}

async function main() {
  console.log('Iniciando seed.');
  await seedUsers();
  await seedBooks();
  console.log('Seed finalizado.');
}

main()
  .catch((e) => {
    console.error('Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
