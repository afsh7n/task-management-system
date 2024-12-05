import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";

describe('LoginController (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;

    const testUser = {
        username: randomStringGenerator(),
        email: randomStringGenerator()+ '@example.com',
        phone: '1234567890',
        password: 'password123',
        hashedPassword: '',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe());

        userService = moduleFixture.get<UserService>(UserService);

        testUser.hashedPassword = await bcrypt.hash(testUser.password, 10);

        await userService.createWithEmail(testUser.email, testUser.hashedPassword);
        await userService.createWithUsername(testUser.username, testUser.hashedPassword);
        await userService.createWithPhone(testUser.phone, testUser.hashedPassword);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/login (POST)', () => {
        it('should login with valid email and password', async () => {
            const loginDto = {
                identifier: testUser.email,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                email: testUser.email,
                username: null,
                token: expect.any(String),
            });
        });

        it('should return 401 for invalid email and password', async () => {
            const loginDto = {
                identifier: 'invalid@example.com',
                password: 'wrongpassword',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(401);


            expect(response.body).toHaveProperty('statusCode', 401);
        });

        it('should login with valid username and password', async () => {
            const loginDto = {
                identifier: testUser.username,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                email: null,
                username: testUser.username,
                token: expect.any(String),
            });
        });

        it('should return 401 for invalid username and password', async () => {
            const loginDto = {
                identifier: 'invaliduser',
                password: 'wrongpassword',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(401);

            expect(response.body).toHaveProperty('statusCode', 401);
        });

        it('should login with valid phone number and password', async () => {
            const loginDto = {
                identifier: testUser.phone,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                email: null,
                phone: testUser.phone,
                token: expect.any(String),
            });
        });

        it('should return 401 for invalid phone number and password', async () => {
            const loginDto = {
                identifier: '0987654321',
                password: 'wrongpassword',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(401);

            expect(response.body).toHaveProperty('statusCode', 401);
        });

        it('should return 400 for empty identifier', async () => {
            const loginDto = {
                identifier: '',
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode', 400);
        });

        it('should return 400 for empty password', async () => {
            const loginDto = {
                identifier: testUser.email,
                password: '',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode', 400);
        });
    });
});
