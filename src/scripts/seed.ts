/**
 * Database seed script for the Bicycle Rental System.
 * Run with: npx tsx src/scripts/seed.ts
 *
 * Uses raw SQL to avoid next-auth import issues in standalone scripts.
 */
import postgres from "postgres";
import bcrypt from "bcryptjs";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://neondb_owner:npg_78sMNUSpZqOj@ep-lively-rain-aq1gpj1d-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = postgres(DATABASE_URL);

async function seed() {
  console.log("🌱 Starting seed...\n");

  // 1. Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const adminId = crypto.randomUUID();
  try {
    await sql`
      INSERT INTO "20260518v1_user" (id, name, email, password, role, "emailVerified", "createdAt")
      VALUES (${adminId}, '系統管理員', 'admin@velocity.tw', ${adminPassword}, 'ADMIN', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `;
    console.log("✅ Admin user created: admin@velocity.tw / admin123");
  } catch (e) {
    console.log("ℹ️  Admin user may already exist");
  }

  // 2. Create demo user
  const userPassword = await bcrypt.hash("user123", 12);
  const userId = crypto.randomUUID();
  try {
    await sql`
      INSERT INTO "20260518v1_user" (id, name, email, password, role, "emailVerified", "createdAt")
      VALUES (${userId}, '王小明', 'user@velocity.tw', ${userPassword}, 'USER', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `;
    console.log("✅ Demo user created: user@velocity.tw / user123");
  } catch (e) {
    console.log("ℹ️  Demo user may already exist");
  }

  // 3. Seed bikes
  const bikesData = [
    {
      name: "Giant TCR Advanced SL",
      type: "ROAD",
      pricePerHour: 80,
      pricePerDay: 500,
      status: "AVAILABLE",
      description:
        "頂級碳纖維公路車，採用 Shimano Ultegra Di2 電子變速系統，適合長距離公路騎行與競賽訓練。",
    },
    {
      name: "Merida Scultura 7000",
      type: "ROAD",
      pricePerHour: 70,
      pricePerDay: 450,
      status: "AVAILABLE",
      description:
        "輕量化公路競速車，搭載碳纖維車架與 Shimano 105 套件，兼具速度與舒適性。",
    },
    {
      name: "Trek Fuel EX 9.8",
      type: "MOUNTAIN",
      pricePerHour: 90,
      pricePerDay: 600,
      status: "AVAILABLE",
      description:
        "全避震登山車，前後 150mm 行程，SRAM Eagle 12速傳動系統，征服各種崎嶇山路。",
    },
    {
      name: "Giant Trance X Advanced",
      type: "MOUNTAIN",
      pricePerHour: 85,
      pricePerDay: 550,
      status: "AVAILABLE",
      description:
        "全碳纖維 trail 登山車，靈活操控搭配強勁避震，山林越野的最佳選擇。",
    },
    {
      name: "Specialized Turbo Vado SL",
      type: "ELECTRIC",
      pricePerHour: 100,
      pricePerDay: 700,
      status: "AVAILABLE",
      description:
        "輕量化電動輔助通勤車，續航力達 130 公里，智慧功率感應器自動調節助力。",
    },
    {
      name: "Giant Explore E+ Pro",
      type: "ELECTRIC",
      pricePerHour: 95,
      pricePerDay: 650,
      status: "AVAILABLE",
      description:
        "探索型電輔車，Yamaha SyncDrive Sport 馬達，500Wh 電池，適合都市通勤與郊外探索。",
    },
    {
      name: "Cannondale SuperSix EVO",
      type: "ROAD",
      pricePerHour: 75,
      pricePerDay: 480,
      status: "MAINTENANCE",
      description:
        "經典公路車型，極致空氣力學設計，Shimano Ultegra 變速，維修保養中。",
    },
    {
      name: "Scott Spark RC 900",
      type: "MOUNTAIN",
      pricePerHour: 100,
      pricePerDay: 680,
      status: "AVAILABLE",
      description:
        "XC 競賽級全避震登山車，TwinLoc 避震鎖定系統，碳纖維車架僅重 10.4kg。",
    },
  ];

  for (const bike of bikesData) {
    try {
      await sql`
        INSERT INTO "20260518v1_bike" (name, type, "pricePerHour", "pricePerDay", status, description, "createdAt")
        VALUES (${bike.name}, ${bike.type}::bike_type, ${bike.pricePerHour}, ${bike.pricePerDay}, ${bike.status}::bike_status, ${bike.description}, NOW())
      `;
    } catch (e) {
      // might already exist
    }
  }
  console.log(`✅ Seeded ${bikesData.length} bikes`);

  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Login credentials:");
  console.log("   Admin: admin@velocity.tw / admin123");
  console.log("   User:  user@velocity.tw / user123");

  await sql.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
