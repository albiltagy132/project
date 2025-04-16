-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "trip_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME,
    "trip_status" TEXT NOT NULL,
    "shift" TEXT NOT NULL DEFAULT 'MORNING',
    "total_drowsy_events" INTEGER NOT NULL DEFAULT 0,
    "total_distraction_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver" ("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("created_at", "driver_id", "end_time", "start_time", "total_distraction_events", "total_drowsy_events", "trip_id", "trip_status", "vehicle_id") SELECT "created_at", "driver_id", "end_time", "start_time", "total_distraction_events", "total_drowsy_events", "trip_id", "trip_status", "vehicle_id" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
