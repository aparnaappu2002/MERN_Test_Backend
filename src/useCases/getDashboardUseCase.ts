import { IUserRepository } from "../domain/interfaces/repositoryInterface/IuserRepository";
import { IGetDashboardUseCase } from "../domain/interfaces/useCaseInterface/IgetDashboardUseCase";
import { mapUserToDTO } from "./mappers/userMapper";
import { UserDTO } from "../domain/dto/userDTO";

export class GetDashboardUseCase implements IGetDashboardUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getDashboardUsers(page: number, search: string): Promise<{ users: UserDTO[]; total: number }> {
    const {users,total} = await this.userRepository.findAllPaginated(page, search);
    return {
      users: users.map(mapUserToDTO),
      total,
    };

  }
}
