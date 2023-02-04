/*
  Warnings:

  - You are about to drop the column `descreption` on the `Alert` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT,
    "level" TEXT,
    "action" TEXT,
    "actionMethod" TEXT,
    "tags" TEXT
);
INSERT INTO "new_Alert" ("action", "actionMethod", "createdAt", "groupId", "id", "level", "tags", "timestamp", "title") SELECT "action", "actionMethod", "createdAt", "groupId", "id", "level", "tags", "timestamp", "title" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
