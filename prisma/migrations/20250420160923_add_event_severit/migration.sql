/*
  Warnings:

  - Made the column `event_severity` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trip_id" INTEGER NOT NULL,
    "event_time" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL,
    "sensor" TEXT NOT NULL,
    "image_proof" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "event_severity" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip" ("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("created_at", "device_id", "event_id", "event_severity", "event_time", "event_type", "image_proof", "sensor", "trip_id") SELECT "created_at", "device_id", "event_id", "event_severity", "event_time", "event_type", "image_proof", "sensor", "trip_id" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
