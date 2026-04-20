const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const bus = await prisma.bus.upsert({
    where: { plateNumber: "BT-TEST-001" },
    update: {},
    create: {
      name: "Test Bus 1",
      plateNumber: "BT-TEST-001",
      capacity: 40,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bustrack.local" },
    update: {},
    create: {
      email: "admin@bustrack.local",
      name: "Test Admin",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.admin,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@bustrack.local" },
    update: {},
    create: {
      email: "parent@bustrack.local",
      name: "Test Parent",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.parent,
    },
  });

  const driverUser = await prisma.user.upsert({
    where: { email: "driver@bustrack.local" },
    update: {},
    create: {
      email: "driver@bustrack.local",
      name: "Test Driver",
      passwordHash: "dev-only-placeholder-hash",
      role: Role.driver,
    },
  });

  const driver = await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {
      busId: bus.id,
    },
    create: {
      userId: driverUser.id,
      busId: bus.id,
    },
  });

  await prisma.route.upsert({
    where: { id: "bt05-seed-route" },
    update: {
      busId: bus.id,
    },
    create: {
      id: "bt05-seed-route",
      name: "Test Route 1",
      busId: bus.id,
    },
  });

  console.log("Seed complete");
  console.log({
    bus: bus.plateNumber,
    driver: driver.id,
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
