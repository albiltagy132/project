-- CreateTable
CREATE TABLE "Driver" (
    "driver_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_expiry" DATETIME NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicle_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicle_number" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    CONSTRAINT "Assignment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver" ("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trip" (
    "trip_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "driver_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME,
    "trip_status" TEXT NOT NULL,
    "total_drowsy_events" INTEGER NOT NULL DEFAULT 0,
    "total_distraction_events" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver" ("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle" ("vehicle_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trip_id" INTEGER NOT NULL,
    "event_time" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL,
    "image_proof" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip" ("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_number_key" ON "Driver"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vehicle_number_key" ON "Vehicle"("vehicle_number");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_device_id_key" ON "Vehicle"("device_id");
