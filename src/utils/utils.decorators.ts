import { createParamDecorator, ExecutionContext, HttpStatus } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { ExceptionResponse } from "../exceptions/common.exception";


export const GetUserIdFromToken = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwt = new JwtService();
    const bearer = request.headers.authorization;
    if (!bearer) {
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'token not found');
    }

    const token = bearer.split(' ')[1];
    const isTrust = jwt.verify(token, {
        secret: process.env.TOKEN_SECRET
    }).catch((e) => {
        console.log(e);
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'token is not valid')
    })
    if (!isTrust) {
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'token is not valid')
    }

    const payload: any = jwt.decode(token);

    if (!payload || !payload.user_id) {
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'token not found');
    }

    return payload.user_id;
});

export const GetToken = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const bearer = request?.headers?.authorization;

    if (!bearer) {
        throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'token not found');
    }
    return bearer.split(' ')[1];
});
