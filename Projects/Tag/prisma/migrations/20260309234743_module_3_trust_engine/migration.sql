-- AlterTable
ALTER TABLE "Product" ADD COLUMN "batchId" TEXT;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "trustScore" REAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_Brand" ("id", "industry", "name") SELECT "id", "industry", "name" FROM "Brand";
DROP TABLE "Brand";
ALTER TABLE "new_Brand" RENAME TO "Brand";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
