-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assignment" (
    "assignment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Assignment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver" ("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Assignment" ("assigned_at", "assignment_id", "driver_id", "status", "vehicle_id") SELECT "assigned_at", "assignment_id", "driver_id", "status", "vehicle_id" FROM "Assignment";
DROP TABLE "Assignment";
ALTER TABLE "new_Assignment" RENAME TO "Assignment";
CREATE UNIQUE INDEX "Assignment_driver_id_key" ON "Assignment"("driver_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
