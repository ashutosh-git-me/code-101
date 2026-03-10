-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentProductId" TEXT,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "batchHash" TEXT NOT NULL,
    CONSTRAINT "Component_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Component" ("batchHash", "id", "name", "origin", "parentProductId") SELECT "batchHash", "id", "name", "origin", "parentProductId" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
