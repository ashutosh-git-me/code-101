/*
  Warnings:

  - You are about to drop the `ProductInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `trustScore` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `batchHash` on the `Component` table. All the data in the column will be lost.
  - Made the column `parentProductId` on table `Component` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ProductInstance_id_idx";

-- DropIndex
DROP INDEX "ProductModel_name_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductInstance";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Review";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currentOwner" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL
);
INSERT INTO "new_Brand" ("id", "industry", "name") SELECT "id", "industry", "name" FROM "Brand";
DROP TABLE "Brand";
ALTER TABLE "new_Brand" RENAME TO "Brand";
CREATE TABLE "new_Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentProductId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    CONSTRAINT "Component_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("id", "name", "origin", "parentProductId") SELECT "id", "name", "origin", "parentProductId" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE TABLE "new_LedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "price" REAL,
    "ownerId" TEXT,
    "metadata" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "prevHash" TEXT NOT NULL,
    CONSTRAINT "LedgerEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LedgerEntry" ("eventType", "hash", "id", "metadata", "ownerId", "prevHash", "price", "productId", "timestamp") SELECT "eventType", "hash", "id", "metadata", "ownerId", "prevHash", "price", "productId", "timestamp" FROM "LedgerEntry";
DROP TABLE "LedgerEntry";
ALTER TABLE "new_LedgerEntry" RENAME TO "LedgerEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
