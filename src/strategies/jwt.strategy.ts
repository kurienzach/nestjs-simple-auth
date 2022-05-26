import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "../auth.service";
import { JwtModuleOptions, JWT_OPTIONS } from "../auth.types";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_OPTIONS) private jwtOptions: JwtModuleOptions,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: jwtOptions.verifyOptions?.ignoreExpiration,
      secretOrKey: jwtOptions.signOptions?.expiresIn || jwtOptions.publicKey,
      secretOrKeyProvider: jwtOptions.secretOrKeyProvider,
      issuer: jwtOptions.verifyOptions?.issuer,
      audience: jwtOptions.verifyOptions?.audience,
      algorithms: jwtOptions.verifyOptions?.algorithms,
    });
  }

  /**
   * Validates the user from the payload
   * @param payload
   * @param done
   * @returns
   */
  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validateJwtPayload(payload);

    if (!user) {
      return done(
        new HttpException("Unauthorized access", HttpStatus.UNAUTHORIZED),
        false
      );
    }

    return done(null, user, null);
  }
}

export { JwtStrategy };
