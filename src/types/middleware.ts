import {Request} from 'express';

export type MRequest = Request & {
  mac: string;
  realIP: any;
  fingerprint: any;
  deviceId: string;
  headers: {
    sign: string;
  };
};
