import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  const PORT = config.port;
  try {
    await prisma.$connect();
    console.log("Prisma Database is connected suscessfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect(); // Disconnect from the database
    process.exit(1); // Exit the process with an error code
  }
}

main();
