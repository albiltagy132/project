/*
  Warnings:

  - You are about to drop the column `license_number` on the `Driver` table. All the data in the column will be lost.
  - Added the required column `id_number` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Driver" (
    "driver_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Driver" ("created_at", "driver_id", "email", "first_name", "image_url", "last_name", "phone_number") SELECT "created_at", "driver_id", "email", "first_name", "image_url", "last_name", "phone_number" FROM "Driver";
DROP TABLE "Driver";
ALTER TABLE "new_Driver" RENAME TO "Driver";
CREATE UNIQUE INDEX "Driver_id_number_key" ON "Driver"("id_number");
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
