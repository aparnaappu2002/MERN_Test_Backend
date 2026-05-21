import { Request, Response } from "express"
import { ISubmitKycUseCase } from "../../domain/interfaces/useCaseInterface/IsubmitKycUseCase"
import { HttpStatus } from "../../domain/enums/HttpStatus"
import { IGetKycStatusUseCase } from "../../domain/interfaces/useCaseInterface/IgetKycStatusUseCase"
import { Messages } from "../../domain/enums/Messages"
import { IJwtPayload } from "../../domain/interfaces/serviceInterface/IjwtPayload"
import { handleErrorResponse,CustomError } from "../../framework/service/errorHandler"
export class UserKycController {

  private submitKycUseCase: ISubmitKycUseCase
  private getKycStatusUseCase:IGetKycStatusUseCase

  constructor(submitKycUseCase: ISubmitKycUseCase,getKycStatusUseCase:IGetKycStatusUseCase) {
    this.submitKycUseCase = submitKycUseCase
    this.getKycStatusUseCase=getKycStatusUseCase
  }

  async submitKyc(req: Request, res: Response): Promise<void> {

    try {

      const userId = (req as Request & { user: IJwtPayload }).user.userId

      if (!userId) {
        throw new CustomError(HttpStatus.UNAUTHORIZED, "Unauthorized")
      }


      const { imageUrl, audioUrl } = req.body

      if (!imageUrl || !audioUrl) {
        throw new CustomError(HttpStatus.BAD_REQUEST, Messages.KYC_REQUIRED)
      }

      if (typeof imageUrl !== "string" ) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid image URL")
      }

      if (typeof audioUrl !== "string" ) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid audio URL")
      }


      if (!imageUrl || !audioUrl) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: Messages.KYC_REQUIRED
        })
        return
      }

      await this.submitKycUseCase.submitKyc(
        userId,
        imageUrl,
        audioUrl
      )

      res.status(HttpStatus.OK).json({
        message: Messages.KYC_SUCCESS
      })

    } catch (error) {

      handleErrorResponse(req, res, error, Messages.KYC_FAILED)


    }

  }

  async getKycStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as Request & { user: IJwtPayload }).user.userId

      if (!userId) {
        throw new CustomError(HttpStatus.UNAUTHORIZED, "Unauthorized")
      }

      const result = await this.getKycStatusUseCase.getKycStatus(userId);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      handleErrorResponse(req, res, error, Messages.KYC_STATUS_ERROR)

    }
  }


}