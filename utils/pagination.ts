import { Repository, FindOptionsWhere, Like, ObjectLiteral } from 'typeorm';

export interface PaginationOptions<T extends ObjectLiteral> {
  pageNumber?: number;
  pageSize?: number;
  filters?: Partial<Record<keyof T, any>>;
  order?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
}

export interface PaginationResult<T> {
  items: T[]; // 改名为 items，更语义化
  total: number;
  page: number;
  pageSize: number;
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: PaginationOptions<T>,
): Promise<PaginationResult<T>> {
  const pageNumber = Number(options.pageNumber) || 1;
  const pageSize = Number(options.pageSize) || 10;
  const order = options.order ?? {};

  // 构造 where
  const where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>;
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const k = key as keyof T;
        where[k] = typeof value === 'string' ? Like(`%${value}%`) : value;
      }
    });
  }

  const [items, total] = await repository.findAndCount({
    where,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    order,
  });

  return { items, total, page: pageNumber, pageSize };
}
