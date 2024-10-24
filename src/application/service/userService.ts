import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { UserUpdateDTO } from "@dto/user/userUpdateDTO";
import { UserRepositoryType } from "@infra/repository/userRepository";
import { NotFoundError } from "@utils/errors";
import { Pageable, PaginationParams } from "@utils/interfaces";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryType) { }

  async getUsersPaginated(pagination: PaginationParams): Promise<Pageable<UserResponseDTO>> {
    const { page, limit } = pagination;
    const [users, total] = await this.userRepository.findAndCount({
      skip: this.calculateOffset(page, limit),
      take: limit,
      order: {
        id: 'ASC',
      },
    });

    const listUserResponse = users.map(e => new UserResponseDTO(e));

    return this.createPageable(listUserResponse, total, page, limit);
  }

  async getUserById(userId: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return new UserResponseDTO(user);
  }

  async updateUser(userId: number, updateData: UserUpdateDTO): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    Object.assign(user, updateData);

    await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.userRepository.remove(user);
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

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
