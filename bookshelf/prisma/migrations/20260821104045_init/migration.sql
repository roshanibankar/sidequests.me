-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "type" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rating" REAL,
    "coverUrl" TEXT,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Book_type_idx" ON "Book"("type");

-- CreateIndex
CREATE INDEX "Book_genre_idx" ON "Book"("genre");

-- CreateIndex
CREATE INDEX "Book_status_idx" ON "Book"("status");
