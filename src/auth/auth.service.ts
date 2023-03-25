import {HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {Repository} from 'typeorm';
import {CatchException, ExceptionResponse,} from '../exceptions/common.exception';
import {UserResponse} from '../user/responses/UserResponse';
import {UserEntity} from '../user/entities/user.entity';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';
import {AuthEntity} from './entities/auth.entity';
import {Request, Response} from "express";
import {TimeToLive} from "../enums/common.enum";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(AuthEntity)
        private readonly authRepo: Repository<AuthEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    userSign(user: UserEntity) {
        return {
            user_id: user.user_id,
            username: user.username,
            account_name: user.account_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            is_verified: user.is_verified,
            date_of_birth: user.date_of_birth,
            address: user.address,
        };
    }

    async register(data: RegisterDto): Promise<boolean> {
        try {
            const user = await this.userRepo.findOne({
                where: {account_name: data.account_name},
            });
            if (user) {
                throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tài khoản đã được đăng ký');
            }
            const saltOrRounds = 10;
            const hash: string = await bcrypt.hash(data.password, saltOrRounds);
            const userSave: UserEntity = await this.userRepo.save({
                ...data,
                password: hash,
            });
            await this.authRepo.save({user: userSave});

            return true;
        } catch (e) {
            throw new CatchException(e);
        }
    }

    async login(loginDto: LoginDto, res: Response): Promise<UserResponse> {
        try {
            //logic
            const {account_name, password} = loginDto;
            const user = await this.userRepo.findOne({where: {account_name}});
            if (!user) {
                throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Tài khoản không tồn tại');
            };

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                throw new ExceptionResponse(HttpStatus.BAD_REQUEST,'Tài khoản / mật khẩu không chính xác');
            };

            delete user.password;

            const accessToken: string = this.generateAccessToken(user);
            const refreshToken: string = this.generateRefreshToken(user);

            await this.authRepo.update(
                {user: {user_id: user.user_id}},
                {access_token: accessToken, refresh_token: refreshToken},
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly:true,
                path: '/',
            });

            return new UserResponse({
                ...user,
                access_token: accessToken,
            });
        } catch (e) {
            throw new CatchException(e);
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken: string = req.cookies['refreshToken'];
            if (!refreshToken) {
                throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'refresh token not found')
            }
            const exist = await this.authRepo.findOne({where: {refresh_token: refreshToken}});
            if (!exist) {
                throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'refresh token is not valid')
            }
            const user: UserEntity | any = this.jwtService.decode(refreshToken);
            const newAccessToken: string = this.generateAccessToken(user);
            const newRefreshToken: string = this.generateRefreshToken(user);

            await this.authRepo.update(
                {user: {user_id: user.user_id}},
                {access_token: newAccessToken, refresh_token: newRefreshToken},
            );
            
            res.cookie('refreshToken', refreshToken);
            return {access_token: newAccessToken};

        } catch (e) {
            throw new CatchException(e);
        }
    }

    generateAccessToken(user: UserEntity): string {
        return this.jwtService.sign(this.userSign(user), {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: TimeToLive.OneDay
        });
    }

    generateRefreshToken(user: UserEntity): string {
        return this.jwtService.sign(this.userSign(user), {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: TimeToLive.OneYear
        });
    }
}