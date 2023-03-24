import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { ExceptionResponse } from "../exceptions/common.exception";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const bearer: string = request.headers.authorization;
    const jwt = new JwtService();

    //logic decode, validate token ...
    if (!bearer) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, "Token not found!");
    }

    const token: string = bearer.split(" ")[1];

    if (!token) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, "Token not found!");
    }

    const isTrust = jwt.verify(token, {
      secret: process.env.TOKEN_SECRET
    }).catch((e) => {
      console.log(e);
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, "token is not valid");
    });
    if (!isTrust) {
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, "token is not valid");
    }
    return true;
  }
}
