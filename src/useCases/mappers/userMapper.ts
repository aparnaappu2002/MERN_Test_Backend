// mappers/userMapper.ts
import { User } from "../../domain/entities/userEntity";
import { KycStatus } from "../../domain/enums/KycStatus";
import { UserDTO } from "../../domain/dto/userDTO";

export const mapUserToDTO = (user: User): UserDTO => ({
  id:        user.id,
  email:     user.email,
  imageUrl:  user.imageUrl,
  audioUrl:  user.audioUrl,
  kycStatus: user.kycStatus ?? KycStatus.PENDING,
  createdAt: user.createdAt?.toISOString() ?? "",
});

export const mapDocToUser = (doc: any): User => ({
  id:        doc._id.toString(),
  email:     doc.email,
  password:  doc.password,
  imageUrl:  doc.imageUrl ?? undefined,
  audioUrl:  doc.audioUrl ?? undefined,
  kycStatus: doc.kycStatus ?? KycStatus.PENDING,
  createdAt: doc.createdAt,
});