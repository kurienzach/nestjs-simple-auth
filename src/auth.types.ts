import { Request } from "express";
import { UserCreateDTO } from "./auth.dto";
import * as jwt from "jsonwebtoken";

type AuthenticatedReq = Request & { user: any };

/**
 * User Service Interface
 */
interface IUserService<T> {
  findByUsernamePassword(username: string, password: string): Promise<T>;
  createUser(userData: UserCreateDTO): Promise<T>;
  findUserById(userId: string): Promise<T>;
  getJwtTokenPayload(user: T): any;
  validateJwtPayload(payload: any): Promise<any>;
}

const USER_SERVICE = "USER_SERVICE";

const JWT_OPTIONS = "JWT_OPTIONS";

/**
 * JWT SERVICE RELATED
 */

export enum JwtSecretRequestType {
  SIGN = 0,
  VERIFY = 1,
}

export interface JwtModuleOptions {
  signOptions?: jwt.SignOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  secretOrPrivateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions
  ) => jwt.Secret;
  verifyOptions?: jwt.VerifyOptions;
}

export interface JwtSignOptions extends jwt.SignOptions {
  secret?: string | Buffer;
  privateKey?: string | Buffer;
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
}

export { AuthenticatedReq, IUserService, USER_SERVICE, JWT_OPTIONS };
