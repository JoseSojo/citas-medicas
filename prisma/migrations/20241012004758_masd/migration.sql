-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DoctroWithSpeciality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "DoctroWithSpeciality_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoctroWithSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoctroWithSpeciality_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DoctroWithSpeciality" ("createAt", "date", "id", "isDelete", "specialityId", "universityId", "updateAt", "userId") SELECT "createAt", "date", "id", "isDelete", "specialityId", "universityId", "updateAt", "userId" FROM "DoctroWithSpeciality";
DROP TABLE "DoctroWithSpeciality";
ALTER TABLE "new_DoctroWithSpeciality" RENAME TO "DoctroWithSpeciality";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
