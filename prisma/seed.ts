import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

// Role enum তোমার যেই জায়গা থেকে আসে সেটাই use করো
import { Role } from "../generated/prisma/client"; // যদি @prisma/client use করো: import { Role } from "@prisma/client";

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  // 1) Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@gearup.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gearup.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  // 2) Provider
  const provider = await prisma.user.upsert({
    where: { email: "provider@gearup.com" },
    update: {},
    create: {
      name: "Provider One",
      email: "provider@gearup.com",
      password: passwordHash,
      role: Role.PROVIDER,
    },
  });

  // 3) Customer
  const customer = await prisma.user.upsert({
    where: { email: "customer@gearup.com" },
    update: {},
    create: {
      name: "Customer One",
      email: "customer@gearup.com",
      password: passwordHash,
      role: Role.CUSTOMER,
    },
  });

  // 4) Categories
  const categories = ["camping", "cycling", "fitness", "water sports"];
  const categoryRows = await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const camping = categoryRows.find((c) => c.name === "camping")!;
  const cycling = categoryRows.find((c) => c.name === "cycling")!;
  const fitness = categoryRows.find((c) => c.name === "fitness")!;
  const water = categoryRows.find((c) => c.name === "water sports")!;

  // 5) Gear + inventory
  const gearData = [
    {
      categoryId: camping.id,
      title: "2-Person Camping Tent",
      brand: "Quechua",
      description: "Lightweight waterproof tent",
      pricePerDay: 350,
      deposit: 1000,
      totalQuantity: 5,
    },
    {
      categoryId: cycling.id,
      title: "Mountain Bike - 27.5 inch",
      brand: "Giant",
      description: "Front suspension MTB",
      pricePerDay: 600,
      deposit: 3000,
      totalQuantity: 2,
    },
    {
      categoryId: fitness.id,
      title: "Dumbbell Set (Adjustable)",
      brand: "Bowflex",
      description: "Adjustable dumbbells",
      pricePerDay: 250,
      deposit: 1200,
      totalQuantity: 4,
    },
    {
      categoryId: water.id,
      title: "Kayak (Single)",
      brand: "Intex",
      description: "Inflatable single-person kayak",
      pricePerDay: 700,
      deposit: 3500,
      totalQuantity: 2,
    },
  ];

  for (const g of gearData) {
    await prisma.gearItem.create({
      data: {
        providerId: provider.id,
        categoryId: g.categoryId,
        title: g.title,
        brand: g.brand,
        description: g.description,
        pricePerDay: g.pricePerDay as any, // Decimal হলে prisma accept করে (বা string)
        deposit: g.deposit as any,
        inventory: {
          create: { totalQuantity: g.totalQuantity },
        },
      },
    });
  }

  console.log("✅ Seed completed");
  console.log("Admin:", admin.email, "pass: 123456");
  console.log("Provider:", provider.email, "pass: 123456");
  console.log("Customer:", customer.email, "pass: 123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
