import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from '../services/register.service';
import { RegisterDto } from '../dto/register/register.dto';
import { TypeIdentifierEnum } from '../enums/typeIdentifier.enum';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';

describe('RegisterController', () => {
    let controller: RegisterController;
    let service: RegisterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RegisterController],
            providers: [
                {
                    provide: RegisterService,
                    useValue: {
                        register: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<RegisterController>(RegisterController);
        service = module.get<RegisterService>(RegisterService);
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
        isActive: true,
        token: 'mock-token-12345',
    };

    describe('register (Email)', () => {
        it('should return UserEntity for valid email and password', async () => {
            const registerDto: RegisterDto = { identifier: 'test@example.com', password: 'password123' };
            jest.spyOn(service, 'register').mockResolvedValue(mockUser);

            const result = await controller.register(registerDto);

            expect(service.register).toHaveBeenCalledWith('test@example.com', 'password123', TypeIdentifierEnum.EMAIL);
            expect(result).toEqual(mockUser);
        });

        it('should throw BadRequestException for invalid email', async () => {
            const registerDto: RegisterDto = { identifier: 'invalid-email', password: 'password123' };
            jest.spyOn(service, 'register').mockRejectedValue(new BadRequestException());

            await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('register (Username)', () => {
        it('should return UserEntity for valid username and password', async () => {
            const registerDto: RegisterDto = { identifier: 'johndoe', password: 'password123' };
            jest.spyOn(service, 'register').mockResolvedValue(mockUser);

            const result = await controller.register(registerDto);

            expect(service.register).toHaveBeenCalledWith('johndoe', 'password123', TypeIdentifierEnum.USERNAME);
            expect(result).toEqual(mockUser);
        });

        it('should throw BadRequestException for invalid username', async () => {
            const registerDto: RegisterDto = { identifier: '', password: 'password123' };
            jest.spyOn(service, 'register').mockRejectedValue(new BadRequestException());

            await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('register (PhoneNumber)', () => {
        it('should return UserEntity for valid phone number and password', async () => {
            const registerDto: RegisterDto = { identifier: '0987654321', password: 'password123' };
            const formattedIdentifier = '98987654321'; // شماره پس از جایگزینی
            jest.spyOn(service, 'register').mockResolvedValue(mockUser);

            const result = await controller.register(registerDto);

            expect(service.register).toHaveBeenCalledWith(formattedIdentifier, 'password123', TypeIdentifierEnum.PHONE);
            expect(result).toEqual(mockUser);
        });

        it('should throw BadRequestException for invalid phone number', async () => {
            const registerDto: RegisterDto = { identifier: '123', password: 'password123' };
            jest.spyOn(service, 'register').mockRejectedValue(new BadRequestException());

            await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('input validation', () => {
        it('should throw BadRequestException for empty identifier', async () => {
            const registerDto: RegisterDto = { identifier: '', password: 'password123' };

            try {
                await controller.register(registerDto);
            } catch (error) {
                console.log('Error for empty identifier:', error); // لاگ خطا
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });

        it('should throw BadRequestException for empty password', async () => {
            const registerDto: RegisterDto = { identifier: 'test@example.com', password: '' };

            try {
                await controller.register(registerDto);
            } catch (error) {
                console.log('Error for empty password:', error); // لاگ خطا
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });
    });
});
