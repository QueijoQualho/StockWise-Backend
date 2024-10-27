import { Pageable, PaginationParams } from "@utils/interfaces";

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function paginateArray<T>(
  items: T[],
  pagination: PaginationParams,
): T[] {
  const { page, limit } = pagination;
  const startIndex = calculateOffset(page, limit);
  const endIndex = Math.min(startIndex + limit, items.length);
  return items.slice(startIndex, endIndex);
}

export function createPageable<T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  limit: number,
): Pageable<T> {
  return {
    data,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage,
  };
}
