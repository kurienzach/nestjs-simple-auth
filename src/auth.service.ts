import { Inject, Injectable } from "@nestjs/common";
import { UserCreateDTO } from "./auth.dto";
import { IUserService, USER_SERVICE } from "./auth.types";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE) private userService: IUserService<any>,
    private jwtService: JwtService
  ) {}

  async validateUsernamePassword(username: string, password: string) {
    return this.userService.findByUsernamePassword(username, password);
  }

  async createUser(data: UserCreateDTO) {
    return this.userService.createUser(data);
  }

  /**
   * Validated the user from the JWT token
   * @param payload
   * @returns user object from the payload
   */
  async validateJwtPayload(payload: any) {
    return this.userService.validateJwtPayload(payload);
  }

  async generateAccessToken(user: any) {
    const payload = this.userService.getJwtTokenPayload(user);
    return this.jwtService.sign(payload);
  }
}
