-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "trustScore" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currentOwner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "prevHash" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LedgerEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentProductId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "batchHash" TEXT NOT NULL,
    CONSTRAINT "Component_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
