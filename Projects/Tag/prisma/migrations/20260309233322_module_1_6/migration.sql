/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    CONSTRAINT "ProductModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductInstance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productModelId" TEXT NOT NULL,
    "currentOwner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "ProductInstance_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "ProductModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentProductId" TEXT,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "batchHash" TEXT NOT NULL,
    CONSTRAINT "Component_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "ProductInstance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("batchHash", "id", "name", "origin", "parentProductId") SELECT "batchHash", "id", "name", "origin", "parentProductId" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE TABLE "new_LedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "prevHash" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LedgerEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductInstance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LedgerEntry" ("eventType", "hash", "id", "metadata", "ownerId", "prevHash", "price", "productId", "timestamp") SELECT "eventType", "hash", "id", "metadata", "ownerId", "prevHash", "price", "productId", "timestamp" FROM "LedgerEntry";
DROP TABLE "LedgerEntry";
ALTER TABLE "new_LedgerEntry" RENAME TO "LedgerEntry";
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductInstance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("id", "isVerified", "productId", "rating", "userId") SELECT "id", "isVerified", "productId", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductModel_name_idx" ON "ProductModel"("name");

-- CreateIndex
CREATE INDEX "ProductInstance_id_idx" ON "ProductInstance"("id");
