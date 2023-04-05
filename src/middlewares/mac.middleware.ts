import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";
import * as getmac from 'getmac'
import {MRequest} from "../types/middleware";
import {UtilCommonTemplate} from "../utils/utils.common";

@Injectable()
export class MacMiddleware implements NestMiddleware {
    use(req: MRequest, res: Response, next: NextFunction) {
        const mac: string = getmac.default();
        const userAgent: string = req.headers['user-agent'];
        const ip: string = req.headers?.['x-forwarded-for']?.toString() || req.ip;

        const deviceId: string = UtilCommonTemplate.generateDeviceId(mac, userAgent, ip);
        req.mac = mac;
        req.deviceId = deviceId;
        next();
    }
}