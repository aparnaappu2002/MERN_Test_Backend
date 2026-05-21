import { KycStatus } from "../enums/KycStatus"
export interface User {
  id: string
  email: string
  password: string
  imageUrl?: string
  audioUrl?: string
  createdAt?: Date
  updatedAt?: Date,
  kycStatus?:KycStatus
}

export type CreateUserInput = Omit<User, "id">
