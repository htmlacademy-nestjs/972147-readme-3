-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "is_repost" BOOLEAN NOT NULL DEFAULT false,
    "original_author_id" TEXT,
    "post_image_id" TEXT,
    "post_link_id" TEXT,
    "post_quote_id" TEXT,
    "post_text_id" TEXT,
    "post_video_id" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_images" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_links" (
    "id" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "post_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "quote_author" TEXT NOT NULL,

    CONSTRAINT "post_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_texts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "announce_text" TEXT NOT NULL,
    "main_text" TEXT NOT NULL,

    CONSTRAINT "post_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_videos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link_url" TEXT NOT NULL,

    CONSTRAINT "post_videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_image_id_key" ON "posts"("post_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_link_id_key" ON "posts"("post_link_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_quote_id_key" ON "posts"("post_quote_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_text_id_key" ON "posts"("post_text_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_video_id_key" ON "posts"("post_video_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_image_id_fkey" FOREIGN KEY ("post_image_id") REFERENCES "post_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_link_id_fkey" FOREIGN KEY ("post_link_id") REFERENCES "post_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_quote_id_fkey" FOREIGN KEY ("post_quote_id") REFERENCES "post_quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_text_id_fkey" FOREIGN KEY ("post_text_id") REFERENCES "post_texts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_post_video_id_fkey" FOREIGN KEY ("post_video_id") REFERENCES "post_videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "posts"
  ADD CONSTRAINT "check_only_one_of_post_types_not_null" CHECK (
        (post_image_id IS NOT NULL)::integer +
        (post_link_id IS NOT NULL)::integer +
        (post_quote_id IS NOT NULL)::integer +
        (post_text_id IS NOT NULL)::integer +
        (post_video_id IS NOT NULL)::integer = 1)
