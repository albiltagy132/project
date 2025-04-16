/*
  Warnings:

  - A unique constraint covering the columns `[driver_id,weekday,shift]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Assignment_driver_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_driver_id_weekday_shift_key" ON "Assignment"("driver_id", "weekday", "shift");
