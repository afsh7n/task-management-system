import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { GenerateJwtTokenUtility } from '../utility/generateJwtToken.utility';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import {CustomHttpException} from "../../../common/exceptions/http.exception";

jest.mock('bcrypt');

describe('LoginService', () => {
    let service: LoginService;
    let userService: UserService;
    let jwtService: JwtService;
    let generateJwtTokenUtility: GenerateJwtTokenUtility;

    const mockUser: UserEntity = {
        id: 1,
        email: 'test@example.com',
        phone: '1234567890',
        username: 'johndoe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        token: '',
        password: '$2b$10$mockhashedpassword', // هش شده رمز عبور
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginService,
                {
                    provide: UserService,
                    useValue: {
                        findWithEmail: jest.fn(),
                        findWithUsername: jest.fn(),
                        findWithPhone: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-jwt-token'),
                    },
                },
                {
                    provide: GenerateJwtTokenUtility,
                    useValue: {
                        generateJwtToken: jest.fn().mockReturnValue('mock-jwt-token'),
                    },
                },
            ],
        }).compile();

        service = module.get<LoginService>(LoginService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        generateJwtTokenUtility = module.get<GenerateJwtTokenUtility>(GenerateJwtTokenUtility);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login (Email)', () => {
        it('should return UserEntity for valid email and password', async () => {
            jest.spyOn(userService, 'findWithEmail').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await service.login('test@example.com', 'password123', TypeIdentifierEnum.EMAIL);

            expect(userService.findWithEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
            expect(generateJwtTokenUtility.generateJwtToken).toHaveBeenCalledWith(jwtService, mockUser);
            expect(result.token).toBe('mock-jwt-token');
            expect(result).toEqual(expect.objectContaining(mockUser));
        });

        it('should throw BadRequestException if user is not found', async () => {
            jest.spyOn(userService, 'findWithEmail').mockResolvedValue(null);

            await expect(service.login('nonexistent@example.com', 'password123', TypeIdentifierEnum.EMAIL))
                .rejects
                .toThrow(CustomHttpException);
        });

        it('should throw BadRequestException if password is invalid', async () => {
            jest.spyOn(userService, 'findWithEmail').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            await expect(service.login('test@example.com', 'wrongpassword', TypeIdentifierEnum.EMAIL))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('login (Username)', () => {
        it('should return UserEntity for valid username and password', async () => {
            jest.spyOn(userService, 'findWithUsername').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await service.login('johndoe', 'password123', TypeIdentifierEnum.USERNAME);

            expect(userService.findWithUsername).toHaveBeenCalledWith('johndoe');
            expect(result.token).toBe('mock-jwt-token');
            expect(result).toEqual(expect.objectContaining(mockUser));
        });

        it('should throw BadRequestException if username is invalid', async () => {
            jest.spyOn(userService, 'findWithUsername').mockResolvedValue(null);

            await expect(service.login('invaliduser', 'password123', TypeIdentifierEnum.USERNAME))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('login (Phone)', () => {
        it('should return UserEntity for valid phone and password', async () => {
            jest.spyOn(userService, 'findWithPhone').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await service.login('1234567890', 'password123', TypeIdentifierEnum.PHONE);

            expect(userService.findWithPhone).toHaveBeenCalledWith('1234567890');
            expect(result.token).toBe('mock-jwt-token');
            expect(result).toEqual(expect.objectContaining(mockUser));
        });

        it('should throw BadRequestException if phone is invalid', async () => {
            jest.spyOn(userService, 'findWithPhone').mockResolvedValue(null);

            await expect(service.login('0987654321', 'password123', TypeIdentifierEnum.PHONE))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('password validation', () => {
        it('should validate password correctly', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const isValid = await service['validationPasswordUser'](mockUser, 'password123');

            expect(isValid).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
        });

        it('should invalidate incorrect password', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const isValid = await service['validationPasswordUser'](mockUser, 'wrongpassword');

            expect(isValid).toBe(false);
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
        });
    });
});
