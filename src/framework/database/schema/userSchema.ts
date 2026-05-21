import { Schema } from "mongoose"
import { KycStatus } from "../../../domain/enums/KycStatus"

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    imageUrl: {
      type: String,
      default: null
    },

    audioUrl: {
      type: String,
      default: null
    },
    kycStatus: {
      type: String,
      enum: Object.values(KycStatus),
      default: "pending",
    },

  },
  {
    timestamps: true
  }
)