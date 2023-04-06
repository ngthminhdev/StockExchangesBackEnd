import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { MRequest } from "../types/middleware";
import { UtilCommonTemplate } from "../utils/utils.common";

const macaddress =  require('macaddress');

@Injectable()
export class MacMiddleware implements NestMiddleware {
  async use(req: MRequest, res: Response, next: NextFunction) {
    const userAgent: string = req.headers["user-agent"];
    const realIp: any = req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const macObj = macaddress.networkInterfaces();
    const mac = macObj?.[Object.keys(macObj)[0]]?.mac || 'unknown';
    console.log({ macObj });


    req.deviceId = UtilCommonTemplate.generateDeviceId(mac, userAgent, realIp);
    req.realIP = realIp;
    next();
  }
}