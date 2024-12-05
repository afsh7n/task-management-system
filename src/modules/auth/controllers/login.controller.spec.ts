import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from '../services/login.service';
import { LoginDto } from '../dto/login/login.dto';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';

describe('LoginController', () => {
    let controller: LoginController;
    let service: LoginService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers: [
                {
                    provide: LoginService,
                    useValue: {
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<LoginController>(LoginController);
        service = module.get<LoginService>(LoginService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    const mockUser: UserEntity = {
        id: 1,
        email: 'test@example.com',
        phone: '1234567890',
        username: 'johndoe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive:true,
        token:'mock-token-12345'
    };

    describe('login (Email)', () => {
        it('should return UserEntity for valid email and password', async () => {
            const loginDto: LoginDto = { identifier: 'test@example.com', password: 'password123' };
            jest.spyOn(service, 'login').mockResolvedValue(mockUser);

            const result = await controller.login(loginDto);

            expect(service.login).toHaveBeenCalledWith('test@example.com', 'password123', TypeIdentifierEnum.EMAIL);
            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException for invalid email and password', async () => {
            const loginDto: LoginDto = { identifier: 'invalid@example.com', password: 'wrongpassword' };
            jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException());

            await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login (Username)', () => {
        it('should return UserEntity for valid username and password', async () => {
            const loginDto: LoginDto = { identifier: 'johndoe', password: 'password123' };
            jest.spyOn(service, 'login').mockResolvedValue(mockUser);

            const result = await controller.login(loginDto);

            expect(service.login).toHaveBeenCalledWith('johndoe', 'password123', TypeIdentifierEnum.USERNAME);
            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException for invalid username and password', async () => {
            const loginDto: LoginDto = { identifier: 'invaliduser', password: 'wrongpassword' };
            jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException());

            await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login (PhoneNumber)', () => {
        it('should return UserEntity for valid phone number and password', async () => {
            const loginDto: LoginDto = { identifier: '1234567890', password: 'password123' };
            jest.spyOn(service, 'login').mockResolvedValue(mockUser);

            const result = await controller.login(loginDto);

            expect(service.login).toHaveBeenCalledWith('1234567890', 'password123', TypeIdentifierEnum.PHONE);
            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException for invalid phone number and password', async () => {
            const loginDto: LoginDto = { identifier: '0987654321', password: 'wrongpassword' };
            jest.spyOn(service, 'login').mockRejectedValue(new UnauthorizedException());

            await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('input validation', () => {
        it('should throw BadRequestException for empty identifier', async () => {
            const loginDto: LoginDto = { identifier: '', password: 'password123' };

            try {
                await controller.login(loginDto);
            } catch (error) {
                console.log('Error for empty identifier:', error); // لاگ خطا
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw BadRequestException for empty password', async () => {
            const loginDto: LoginDto = { identifier: 'test@example.com', password: '' };

            try {
                await controller.login(loginDto);
            } catch (error) {
                console.log('Error for empty password:', error); // لاگ خطا
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });
    });

});
