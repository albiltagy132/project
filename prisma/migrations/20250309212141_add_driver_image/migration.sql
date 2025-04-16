/*
  Warnings:

  - You are about to drop the column `dob` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `license_expiry` on the `Driver` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Driver" (
    "driver_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Driver" ("created_at", "driver_id", "email", "first_name", "last_name", "license_number", "phone_number") SELECT "created_at", "driver_id", "email", "first_name", "last_name", "license_number", "phone_number" FROM "Driver";
DROP TABLE "Driver";
ALTER TABLE "new_Driver" RENAME TO "Driver";
CREATE UNIQUE INDEX "Driver_license_number_key" ON "Driver"("license_number");
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
