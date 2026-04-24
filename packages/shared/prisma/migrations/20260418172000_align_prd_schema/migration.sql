-- DropIndex
DROP INDEX "Driver_licenseNo_key";

-- DropIndex
DROP INDEX "Bus_busCode_key";

-- DropIndex
DROP INDEX "Route_routeCode_key";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "isActive",
DROP COLUMN "licenseNo",
DROP COLUMN "phoneNumber",
ADD COLUMN     "bus_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Bus" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "routeCode",
ADD COLUMN     "bus_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "scheduledStart";

-- AlterTable
ALTER TABLE "LocationPing" DROP COLUMN "createdAt",
DROP COLUMN "heading";

-- CreateIndex
CREATE INDEX "Driver_bus_id_idx" ON "Driver"("bus_id");

-- CreateIndex
CREATE INDEX "Route_bus_id_idx" ON "Route"("bus_id");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
