import { prisma } from "./lib/prisma";
import app from "./app";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    //prisma k connect kora
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("an error occurred.", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
