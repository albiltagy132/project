/*
  Warnings:

  - Added the required column `weekday` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "assignment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "shift" TEXT NOT NULL DEFAULT 'MORNING',
    "weekday" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Assignment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver" ("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("assigned_at", "assignment_id", "driver_id", "shift", "status", "vehicle_id") SELECT "assigned_at", "assignment_id", "driver_id", "shift", "status", "vehicle_id" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE UNIQUE INDEX "Assignment_driver_id_key" ON "Assignment"("driver_id");
CREATE UNIQUE INDEX "Assignment_vehicle_id_weekday_shift_key" ON "Assignment"("vehicle_id", "weekday", "shift");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
