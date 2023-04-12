-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "posts_metadata" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "is_repost" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT,

    CONSTRAINT "posts_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_images" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "post_metadata_id" INTEGER NOT NULL,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_links" (
    "id" SERIAL NOT NULL,
    "link_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "post_metadata_id" INTEGER NOT NULL,

    CONSTRAINT "post_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_quotes" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "quote_author" TEXT NOT NULL,
    "post_metadata_id" INTEGER NOT NULL,

    CONSTRAINT "post_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_texts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "announce_text" TEXT NOT NULL,
    "main_text" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_videos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_images_post_metadata_id_key" ON "post_images"("post_metadata_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_links_post_metadata_id_key" ON "post_links"("post_metadata_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_quotes_post_metadata_id_key" ON "post_quotes"("post_metadata_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_texts_post_id_key" ON "post_texts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_videos_post_id_key" ON "post_videos"("post_id");

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
