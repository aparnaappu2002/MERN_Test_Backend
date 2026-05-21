import { UserDTO } from "../../dto/userDTO";

export interface IGetDashboardUseCase {
  getDashboardUsers(page: number, search: string): Promise<{ users: UserDTO[]; total: number }>;
}