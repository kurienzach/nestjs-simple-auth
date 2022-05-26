import { SimpleAuthModule, ProviderOptions } from "./auth.module";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./guards/public.guard";
import { IUserService, USER_SERVICE } from "./auth.types";
import { UserCreateDTO } from "./auth.dto";
import { JwtService } from "./jwt.service";

export {
  SimpleAuthModule,
  LocalAuthGuard,
  Public,
  USER_SERVICE,
  JwtService,
  UserCreateDTO,
};

export type { IUserService, ProviderOptions };
