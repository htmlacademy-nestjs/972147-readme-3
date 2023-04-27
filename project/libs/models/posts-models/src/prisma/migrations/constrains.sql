ALTER TABLE "posts"
  ADD CONSTRAINT "check_only_one_of_post_types_not_null" CHECK (
        (post_image_id IS NOT NULL)::integer +
        (post_link_id IS NOT NULL)::integer +
        (post_quote_id IS NOT NULL)::integer +
        (post_text_id IS NOT NULL)::integer +
        (post_video_id IS NOT NULL)::integer = 1);
