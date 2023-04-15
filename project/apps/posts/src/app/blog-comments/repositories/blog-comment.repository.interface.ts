import { CrudRepository } from "@project/util/util-types";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { UpdateCommentDto } from "../dto/update-comment.dto";
import { Comment } from "@project/shared/app-types";

export type WithAuthorId<T> = T & { authorId: string };

export interface BlogCommentRepositoryInterface extends CrudRepository<string, WithAuthorId<CreateCommentDto>, UpdateCommentDto, Comment> {
  list(postId: string): Promise<Comment[]>;
}
