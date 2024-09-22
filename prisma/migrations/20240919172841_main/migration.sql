-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cmeg_n" TEXT,
    "matricula" TEXT,
    "ci" TEXT NOT NULL,
    "createDate" DATETIME,
    "phoneCode" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL,
    "addressId" TEXT,
    "parentId" TEXT,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressId", "ci", "cmeg_n", "createAt", "createDate", "email", "id", "isDelete", "lastname", "matricula", "name", "parentId", "password", "phoneCode", "phoneNumber", "role", "updateAt") SELECT "addressId", "ci", "cmeg_n", "createAt", "createDate", "email", "id", "isDelete", "lastname", "matricula", "name", "parentId", "password", "phoneCode", "phoneNumber", "role", "updateAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
