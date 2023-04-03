import { ApiResult } from "./api-result";

export interface CrudRepository<Id, Entity, CreateDTO, UpdateDTO> {
  get(id: Id): ApiResult<Entity>;

  create(createDTO: CreateDTO): ApiResult<Entity>;

  update(updateDTO: UpdateDTO): ApiResult<Entity>;

  delete(id: Id): ApiResult<void>;
}
