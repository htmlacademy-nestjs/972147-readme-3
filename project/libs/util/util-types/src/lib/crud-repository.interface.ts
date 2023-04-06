export interface CrudRepository<Id, Entity, Result> {
  get(id: Id): Promise<Result | null>;

  create(entity: Entity): Promise<Result>;

  update(id: Id, entity: Entity): Promise<Result>;

  delete(id: Id): Promise<void>;
}
