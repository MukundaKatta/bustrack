const { PrismaClient, Role } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { hashSync } = require("bcryptjs");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run prisma seed.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoPassword = "BusTrack@123";
  const passwordHash = hashSync(demoPassword, 10);

  const busSpecs = [
    { name: "Bus A1", plateNumber: "BT-25-001", capacity: 40 },
    { name: "Bus A2", plateNumber: "BT-25-002", capacity: 42 },
    { name: "Bus A3", plateNumber: "BT-25-003", capacity: 38 },
  ];

  const buses = [];
  for (const busSpec of busSpecs) {
    const bus = await prisma.bus.upsert({
      where: { plateNumber: busSpec.plateNumber },
      update: {
        name: busSpec.name,
        capacity: busSpec.capacity,
      },
      create: busSpec,
    });
    buses.push(bus);
  }

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bustrack.local" },
    update: {
      name: "Admin User",
      role: Role.admin,
      passwordHash,
    },
    create: {
      email: "admin@bustrack.local",
      name: "Admin User",
      role: Role.admin,
      passwordHash,
    },
  });

  const parentSpecs = [
    { email: "parent1@bustrack.local", name: "Parent One" },
    { email: "parent2@bustrack.local", name: "Parent Two" },
  ];

  const parentUsers = [];
  for (const parentSpec of parentSpecs) {
    const parent = await prisma.user.upsert({
      where: { email: parentSpec.email },
      update: {
        name: parentSpec.name,
        role: Role.parent,
        passwordHash,
      },
      create: {
        ...parentSpec,
        role: Role.parent,
        passwordHash,
      },
    });
    parentUsers.push(parent);
  }

  const driverSpecs = [
    { email: "driver1@bustrack.local", name: "Driver One", busId: buses[0].id },
    { email: "driver2@bustrack.local", name: "Driver Two", busId: buses[1].id },
    { email: "driver3@bustrack.local", name: "Driver Three", busId: buses[2].id },
  ];

  const drivers = [];
  for (const driverSpec of driverSpecs) {
    const user = await prisma.user.upsert({
      where: { email: driverSpec.email },
      update: {
        name: driverSpec.name,
        role: Role.driver,
        passwordHash,
      },
      create: {
        email: driverSpec.email,
        name: driverSpec.name,
        role: Role.driver,
        passwordHash,
      },
    });

    const driver = await prisma.driver.upsert({
      where: { userId: user.id },
      update: {
        busId: driverSpec.busId,
      },
      create: {
        userId: user.id,
        busId: driverSpec.busId,
      },
    });

    drivers.push({ user, driver });
  }

  const routeSpecs = [
    {
      id: "bt25-route-1",
      name: "North Loop",
      busId: buses[0].id,
      stops: [
        { name: "North Gate", latitude: 38.8315, longitude: -77.3071, sequence: 1 },
        { name: "Maple Street", latitude: 38.8351, longitude: -77.3002, sequence: 2 },
        { name: "Oak Meadows", latitude: 38.8394, longitude: -77.2936, sequence: 3 },
        { name: "Pine Hills", latitude: 38.8441, longitude: -77.288, sequence: 4 },
        { name: "School Main", latitude: 38.8482, longitude: -77.2827, sequence: 5 },
      ],
    },
    {
      id: "bt25-route-2",
      name: "South Loop",
      busId: buses[1].id,
      stops: [
        { name: "South Gate", latitude: 38.8199, longitude: -77.3168, sequence: 1 },
        { name: "River Bend", latitude: 38.8152, longitude: -77.3094, sequence: 2 },
        { name: "Cedar Park", latitude: 38.8108, longitude: -77.3021, sequence: 3 },
        { name: "Elm Court", latitude: 38.8067, longitude: -77.2958, sequence: 4 },
      ],
    },
  ];

  for (const routeSpec of routeSpecs) {
    const route = await prisma.route.upsert({
      where: { id: routeSpec.id },
      update: {
        name: routeSpec.name,
        busId: routeSpec.busId,
      },
      create: {
        id: routeSpec.id,
        name: routeSpec.name,
        busId: routeSpec.busId,
      },
    });

    await prisma.stop.deleteMany({ where: { routeId: route.id } });
    await prisma.stop.createMany({
      data: routeSpec.stops.map((stop) => ({
        routeId: route.id,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
        sequence: stop.sequence,
      })),
    });
  }

  console.log("BT-25 seed complete");
  console.log({
    demoPassword,
    buses: buses.map((bus) => bus.plateNumber),
    adminUser: adminUser.email,
    parentUsers: parentUsers.map((parent) => parent.email),
    driverUsers: drivers.map(({ user }) => user.email),
    routes: routeSpecs.map((route) => route.name),
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
