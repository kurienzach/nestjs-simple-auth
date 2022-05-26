import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import {
  IUserService,
  JwtModuleOptions,
  JWT_OPTIONS,
  USER_SERVICE,
} from "./auth.types";
import { randomUUID } from "crypto";
import { Class } from "./util";
import { JwtService } from "./jwt.service";

/** **************************************************
 * NEST JS CUSTOM PROVIDER
 *************************************************** */

export interface ProviderOptions<T> extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Class<T>;
  useClass?: Class<T>;
  useValue?: T;
  useFactory?: (...args: any[]) => T;
  inject?: any[];
}

function generateProvider(
  name: string,
  options: ProviderOptions<any>
): Provider {
  if (options.useFactory) {
    return {
      provide: name,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  if (options.useClass) {
    return {
      provide: name,
      inject: options.inject || [],
      useClass: options.useClass,
    };
  }

  if (options.useExisting) {
    return {
      provide: name,
      useExisting: options.useExisting,
    };
  }

  return {
    provide: name,
    useValue: options.useValue,
  };
}

/** **************************************************
 * AUTH MODULE DEFINITION
 *************************************************** */

export interface AuthModuleOptions {
  userServiceProvider: ProviderOptions<IUserService<any>>;
  jwtOptions?: JwtModuleOptions;
  jwtOptionsProvider?: ProviderOptions<JwtModuleOptions>;
  customStrategiesProvider?: ProviderOptions<any>[];
  disableBuiltInController?: boolean;
}

@Module({})
export class SimpleAuthModule {
  static register(options?: AuthModuleOptions): DynamicModule {
    const userServiceProvider = options.userServiceProvider;

    const strategiesProviders = options.customStrategiesProvider
      ? options.customStrategiesProvider.map((s) =>
          generateProvider(`STRATEGY-${randomUUID()}`, s)
        )
      : [LocalStrategy, JwtStrategy];

    const moduleDef: DynamicModule = {
      module: SimpleAuthModule,
      controllers: [AuthController],
      imports: [...userServiceProvider.imports],
      providers: [
        AuthService,
        generateProvider(USER_SERVICE, userServiceProvider),
        ...strategiesProviders,
        JwtService,
      ],
      exports: [AuthService, JwtService],
    };

    if (options.jwtOptions) {
      moduleDef.providers.push({
        provide: JWT_OPTIONS,
        useValue: options.jwtOptions,
      });
      // moduleDef.imports.push(JwtModule.register(options.jwtOptions));
    } else if (options.jwtOptionsProvider) {
      moduleDef.imports = [
        ...moduleDef.imports,
        ...options.jwtOptionsProvider.imports,
      ];
      moduleDef.providers.push(
        generateProvider(JWT_OPTIONS, options.jwtOptionsProvider)
      );
    } else {
      throw new Error(
        "Module requires either jwtOptions or jwtOptionsProvider to be specified"
      );
    }

    if (options.disableBuiltInController) {
      moduleDef.controllers = [];
    }

    return moduleDef;
  }
}
