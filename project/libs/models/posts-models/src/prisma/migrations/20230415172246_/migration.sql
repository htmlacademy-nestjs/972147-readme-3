/*
  Warnings:

  - A unique constraint covering the columns `[author_id,post_id]` on the table `likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "likes_author_id_post_id_key" ON "likes"("author_id", "post_id");
