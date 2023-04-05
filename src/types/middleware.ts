import {Request} from 'express';

export type MRequest = Request & {
  mac: string;
  fingerprint: any;
  deviceId: string;
  headers: {
    sign: string;
  };
};
