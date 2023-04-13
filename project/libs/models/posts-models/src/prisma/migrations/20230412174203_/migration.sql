/*
  Warnings:

  - The primary key for the `post_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_quotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_texts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_videos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `posts_metadata` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "post_images" DROP CONSTRAINT "post_images_post_metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "post_links" DROP CONSTRAINT "post_links_post_metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "post_quotes" DROP CONSTRAINT "post_quotes_post_metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "post_texts" DROP CONSTRAINT "post_texts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_videos" DROP CONSTRAINT "post_videos_post_id_fkey";

-- AlterTable
ALTER TABLE "post_images" DROP CONSTRAINT "post_images_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_metadata_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_images_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_images_id_seq";

-- AlterTable
ALTER TABLE "post_links" DROP CONSTRAINT "post_links_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_metadata_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_links_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_links_id_seq";

-- AlterTable
ALTER TABLE "post_quotes" DROP CONSTRAINT "post_quotes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_metadata_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_quotes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_quotes_id_seq";

-- AlterTable
ALTER TABLE "post_texts" DROP CONSTRAINT "post_texts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_texts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_texts_id_seq";

-- AlterTable
ALTER TABLE "post_videos" DROP CONSTRAINT "post_videos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_videos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_videos_id_seq";

-- AlterTable
ALTER TABLE "posts_metadata" DROP CONSTRAINT "posts_metadata_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "posts_metadata_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "posts_metadata_id_seq";

-- AddForeignKey
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_metadata_id_fkey" FOREIGN KEY ("post_metadata_id") REFERENCES "posts_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_links" ADD CONSTRAINT "post_links_post_metadata_id_fkey" FOREIGN KEY ("post_metadata_id") REFERENCES "posts_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_quotes" ADD CONSTRAINT "post_quotes_post_metadata_id_fkey" FOREIGN KEY ("post_metadata_id") REFERENCES "posts_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_texts" ADD CONSTRAINT "post_texts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_videos" ADD CONSTRAINT "post_videos_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
