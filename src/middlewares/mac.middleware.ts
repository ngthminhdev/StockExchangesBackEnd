import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import getMAC from "getmac";
import { MRequest } from "../types/middleware";
import { UtilCommonTemplate } from "../utils/utils.common";

@Injectable()
export class MacMiddleware implements NestMiddleware {
  use(req: MRequest, res: Response, next: NextFunction) {
    const userAgent: string = req.headers["user-agent"];
    const realIp: any = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const mac: string = getMAC();
    const deviceId: string = UtilCommonTemplate.generateDeviceId(mac, userAgent, realIp);

    req.mac = mac;
    req.deviceId = deviceId;
    req.realIP = realIp;
    next();
  }
}