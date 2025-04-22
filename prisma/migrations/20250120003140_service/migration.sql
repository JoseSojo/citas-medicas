-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "costo" DECIMAL,
    "doctorId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Services_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Services" ("createAt", "description", "doctorId", "id", "isDelete", "name", "updateAt") SELECT "createAt", "description", "doctorId", "id", "isDelete", "name", "updateAt" FROM "Services";
DROP TABLE "Services";
ALTER TABLE "new_Services" RENAME TO "Services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
