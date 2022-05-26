import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UserCreateDTO } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthenticatedReq } from "./auth.types";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: AuthenticatedReq) {
    const access = await this.authService.generateAccessToken(req.user);
    return {
      access,
    };
  }

  @Post("register")
  async register(@Body() data: UserCreateDTO) {
    return this.authService.createUser(data);
  }
}
