import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { GenerateJwtTokenUtility } from '../utility/generateJwtToken.utility';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import {CustomHttpException} from "../../../common/exceptions/http.exception";

jest.mock('bcrypt');


describe('RegisterService', () => {
    let service: RegisterService;
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
        password: 'hashed-password',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
                {
                    provide: UserService,
                    useValue: {
                        findWithEmail: jest.fn(),
                        findWithPhone: jest.fn(),
                        findWithUsername: jest.fn(),
                        createWithEmail: jest.fn(),
                        createWithPhone: jest.fn(),
                        createWithUsername: jest.fn(),
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

        service = module.get<RegisterService>(RegisterService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        generateJwtTokenUtility = module.get<GenerateJwtTokenUtility>(GenerateJwtTokenUtility);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register (Email)', () => {
        it('should create a new user with email', async () => {
            jest.spyOn(userService, 'findWithEmail').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
            jest.spyOn(userService, 'createWithEmail').mockResolvedValue({ ...mockUser, token: 'mock-jwt-token' });

            const result = await service.register('test@example.com', 'password123', TypeIdentifierEnum.EMAIL);

            expect(userService.findWithEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userService.createWithEmail).toHaveBeenCalledWith('test@example.com', 'hashed-password');
            expect(generateJwtTokenUtility.generateJwtToken).toHaveBeenCalledWith(jwtService, result);
            expect(result.token).toBe('mock-jwt-token');
        });

        it('should throw BadRequestException if email already exists', async () => {
            jest.spyOn(userService, 'findWithEmail').mockResolvedValue(mockUser);

            await expect(service.register('test@example.com', 'password123', TypeIdentifierEnum.EMAIL))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('register (Phone)', () => {
        it('should create a new user with phone', async () => {
            jest.spyOn(userService, 'findWithPhone').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
            jest.spyOn(userService, 'createWithPhone').mockResolvedValue({ ...mockUser, token: 'mock-jwt-token' });

            const result = await service.register('1234567890', 'password123', TypeIdentifierEnum.PHONE);

            expect(userService.findWithPhone).toHaveBeenCalledWith('1234567890');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userService.createWithPhone).toHaveBeenCalledWith('1234567890', 'hashed-password');
            expect(result.token).toBe('mock-jwt-token');
        });

        it('should throw BadRequestException if phone already exists', async () => {
            jest.spyOn(userService, 'findWithPhone').mockResolvedValue(mockUser);

            await expect(service.register('1234567890', 'password123', TypeIdentifierEnum.PHONE))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('register (Username)', () => {
        it('should create a new user with username', async () => {
            jest.spyOn(userService, 'findWithUsername').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
            jest.spyOn(userService, 'createWithUsername').mockResolvedValue({ ...mockUser, token: 'mock-jwt-token' });

            const result = await service.register('johndoe', 'password123', TypeIdentifierEnum.USERNAME);

            expect(userService.findWithUsername).toHaveBeenCalledWith('johndoe');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(userService.createWithUsername).toHaveBeenCalledWith('johndoe', 'hashed-password');
            expect(result.token).toBe('mock-jwt-token');
        });

        it('should throw BadRequestException if username already exists', async () => {
            jest.spyOn(userService, 'findWithUsername').mockResolvedValue(mockUser);

            await expect(service.register('johndoe', 'password123', TypeIdentifierEnum.USERNAME))
                .rejects
                .toThrow(CustomHttpException);
        });
    });

    describe('password hashing', () => {
        it('should hash the password correctly', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');

            const hashedPassword = await bcrypt.hash('password123', 10);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(hashedPassword).toBe('hashed-password');
        });
    });
});
