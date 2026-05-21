import { Request, Response } from "express"
import { IUserRegisterUseCase } from "../../domain/interfaces/useCaseInterface/IUserRegisterUseCase"
import { IUserLoginUseCase } from "../../domain/interfaces/useCaseInterface/IuserLoginUseCase"
import { IJwtService } from "../../domain/interfaces/serviceInterface/IjwtService"
import { IJwtPayload } from "../../domain/interfaces/serviceInterface/IjwtPayload"
import { HttpStatus } from "../../domain/enums/HttpStatus"
import { setCookie } from "../../framework/service/tokenCookieSetting"
import { Messages } from "../../domain/enums/Messages"
import { mapUserToDTO } from "../../useCases/mappers/userMapper"
import { handleErrorResponse,CustomError } from "../../framework/service/errorHandler"

export class UserAuthController {

  private registerUseCase: IUserRegisterUseCase
  private loginUseCase: IUserLoginUseCase
  private jwtService: IJwtService

  constructor(
    registerUseCase: IUserRegisterUseCase,
    loginUseCase: IUserLoginUseCase,
    jwtService: IJwtService
  ) {
    this.registerUseCase = registerUseCase
    this.loginUseCase = loginUseCase
    this.jwtService = jwtService
  }

  async handleRegister(req: Request, res: Response): Promise<void> {
    try {

      const { email, password } = req.body

      if (!email || !password) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Email and password are required")
      }

      if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid email format")
      }

      if (typeof password !== "string" || password.length < 6) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters")
      }


      const user = await this.registerUseCase.registerUser(email, password)

      console.log(`User registered successfully - email: ${email}`)

      res.status(HttpStatus.CREATED).json({
        message: Messages.REGISTER_SUCCESS,
        user:mapUserToDTO(user)
      })

    } catch (error) {

      handleErrorResponse(req, res, error, Messages.REGISTER_FAILED)


    }
  }

  async handleLogin(req: Request, res: Response): Promise<void> {

    try {

      const { email, password } = req.body

      if (!email || !password) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Email and password are required")
      }

      if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Invalid email format")
      }

      if (typeof password !== "string" || password.length < 6) {
        throw new CustomError(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters")
      }


      const user = await this.loginUseCase.loginUser(email, password)

      if (!user) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Invalid credentials"
        })
        return
      }

      const payload: IJwtPayload = {
        userId: user.id?.toString() || "",
        email: user.email
      }

      const token = this.jwtService.generateToken(payload)

      setCookie(res, token)

      console.log(`User login successful - email: ${email}`)

      res.status(HttpStatus.OK).json({
        message: Messages.LOGIN_SUCCESS,
        user:mapUserToDTO(user),
        token
      })

    } catch (error) {
      

      handleErrorResponse(req, res, error, Messages.LOGIN_ERROR)


    }

  }

}