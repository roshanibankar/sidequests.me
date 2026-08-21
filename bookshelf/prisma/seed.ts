import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Intentionally empty — the shelf starts blank and you add books yourself
// through the login screen. Kept as a script (rather than deleted) so
// `npm run seed` stays a harmless no-op if it's ever run again, and so a
// future version of this file has somewhere obvious to add books back.

async function main() {
  const existing = await prisma.book.count();
  console.log(
    existing > 0
      ? `Database already has ${existing} book(s) — nothing to seed.`
      : "No books to seed. Log in and use \u201c+ Add a book\u201d to start your shelf."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
