export interface CrudRepository<Id, CreateDTO, UpdateDTO, Result> {
  get(id: Id): Promise<Result | null>;

  create(dto: CreateDTO): Promise<Result>;

  update(id: Id, dto: UpdateDTO): Promise<Result>;

  delete(id: Id): Promise<void>;
}
