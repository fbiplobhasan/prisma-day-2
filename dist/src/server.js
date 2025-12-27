"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./lib/prisma");
const app_1 = __importDefault(require("../prisma/app"));
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        //prisma k connect kora
        await prisma_1.prisma.$connect();
        console.log("Connected to the database successfully.");
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("an error occurred.", error);
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
}
main();
//# sourceMappingURL=server.js.map