const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bustrack.local" },
    update: {},
    create: {
      email: "admin@bustrack.local",
      fullName: "Test Admin",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.ADMIN,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@bustrack.local" },
    update: {},
    create: {
      email: "parent@bustrack.local",
      fullName: "Test Parent",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.PARENT,
    },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: "driver@bustrack.local" },
    update: {},
    create: {
      email: "driver@bustrack.local",
      fullName: "Test Driver",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.DRIVER,
    },
  });

  console.log("Seed complete");
  console.log({
    adminUser: adminUser.email,
    parentUser: parentUser.email,
    driverUser: driverUser.email,
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
