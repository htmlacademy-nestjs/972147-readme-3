import { ClassConstructor, plainToInstance } from 'class-transformer';

export const fillObject = <T, V>(dto: ClassConstructor<T>, plainObject: V): T => {
  return plainToInstance(dto, plainObject, {excludeExtraneousValues: true});
};
