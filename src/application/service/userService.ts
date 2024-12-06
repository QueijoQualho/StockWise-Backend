import { SignupDTO } from "@dto/user/signupDTO";
import { UserResponseDTO } from "@dto/user/userResponseDTO";
import { UserUpdateDTO } from "@dto/user/userUpdateDTO";
import { UserRepositoryType } from "@infra/repository/userRepository";
import { User } from "@model/userEntity";
import { BadRequestError, NotFoundError } from "@utils/errors";
import { calculateOffset, createPageable } from "@utils/helpers/paginationUtil";
import { Pageable, PaginationParams } from "@utils/interfaces";

export class UserService {
  constructor(private readonly userRepository: UserRepositoryType) {}

  async getUsersPaginated(
    pagination: PaginationParams,
  ): Promise<Pageable<UserResponseDTO>> {
    const [users, total] = await this.fetchPaginatedUsers(pagination);
    const listUserResponse = this.mapToResponseDTO(users);

    return createPageable(
      listUserResponse,
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async getUserById(userId: number): Promise<UserResponseDTO> {
    const user = await this.findUserOrThrow(userId);
    return new UserResponseDTO(user);
  }

  async getUserbyEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({where: {email: email}})
  }

  async createUser(createData: SignupDTO): Promise<UserResponseDTO> {
    const existingUser = await this.getUserbyEmail(createData.email);

    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const newUser = this.userRepository.create(createData);

    const savedUser = await this.userRepository.save(newUser);

    return new UserResponseDTO(savedUser);
  }



  async updateUser(userId: number, updateData: UserUpdateDTO): Promise<void> {
    const user = await this.findUserOrThrow(userId);
    Object.assign(user, updateData);
    await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findUserOrThrow(userId);
    await this.userRepository.remove(user);
  }

  // ======================================
  // = HELPER METHODS =
  // ======================================

  private async findUserOrThrow(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  private async fetchPaginatedUsers(
    pagination: PaginationParams,
  ): Promise<[User[], number]> {
    const { page, limit } = pagination;
    return this.userRepository.findAndCount({
      skip: calculateOffset(page, limit),
      take: limit,
      order: { id: "ASC" },
    });
  }

  private mapToResponseDTO(users: User[]): UserResponseDTO[] {
    return users.map((user) => new UserResponseDTO(user));
  }
}
