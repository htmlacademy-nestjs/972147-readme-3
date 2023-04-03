import { Result } from 'oxide.ts';

export type ApiResult<T> = Promise<Result<T, Error>>;
