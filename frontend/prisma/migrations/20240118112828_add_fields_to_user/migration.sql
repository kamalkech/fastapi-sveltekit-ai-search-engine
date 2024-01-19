/*
  Warnings:

  - Added the required column `code` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "firstname", "id", "lastname", "password", "status") SELECT "email", "firstname", "id", "lastname", "password", "status" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
