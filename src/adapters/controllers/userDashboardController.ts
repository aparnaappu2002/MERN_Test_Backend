import { Request, Response } from "express";
import { IGetDashboardUseCase } from "../../domain/interfaces/useCaseInterface/IgetDashboardUseCase";
import { HttpStatus } from "../../domain/enums/HttpStatus";
import { Messages } from "../../domain/enums/Messages";
import { handleErrorResponse,CustomError } from "../../framework/service/errorHandler";


export class UserDashboardController {
  private getDashboardUseCase: IGetDashboardUseCase;

  constructor(getDashboardUseCase: IGetDashboardUseCase) {
    this.getDashboardUseCase = getDashboardUseCase;
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const search = (req.query.search as string) || "";

      

      if (page < 1) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Page must be greater than 0")
      }

      if (search && typeof search !== "string") {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Search must be a string")
      }

      if (search && search.length > 100) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Search query too long")
      }


      const result = await this.getDashboardUseCase.getDashboardUsers(page, search);

      res.status(HttpStatus.OK).json({
        users: result.users,
        total: result.total,
      });
    } catch (error) {
      handleErrorResponse(req, res, error, Messages.DASHBOARD_DATA_ERROR);

    }
  }
}