import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { UserRepositoryType } from "@infra/repository/userRepository";
import { Pageable, PaginationParams } from "@utils/interfaces";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryType){}


  async getUsersPaginated(pagination: PaginationParams): Promise<Pageable<UserResponseDTO>> {
    const { page, limit } = pagination;
    const [users, total] = await this.userRepository.findAndCount({
      skip: this.calculateOffset(page, limit),
      take: limit,
    });

    const listUserResponse = users.map(e => new UserResponseDTO(e))

    return this.createPageable(
      listUserResponse,
      total,
      page,
      limit
    )
  }

  private createPageable<T>(
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

  private calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
