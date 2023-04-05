import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import * as getmac from "getmac";
import { MRequest } from "../types/middleware";

@Injectable()
export class MacMiddleware implements NestMiddleware {
    use(req: MRequest, res: Response, next: NextFunction) {
        const mac: string = getmac.default();
        const fingerprint = req.fingerprint;

        const deviceId: string = fingerprint.hash;
        req.mac = mac;
        req.deviceId = deviceId;
        next();
    }
}