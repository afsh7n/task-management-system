import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

describe('RegisterController (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;

    const testUser = {
        email: randomStringGenerator() + '@example.com',
        username: randomStringGenerator(),
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

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/register (POST)', () => {
        it('should register with valid email and password', async () => {
            const registerDto = {
                identifier: testUser.email,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                email: registerDto.identifier,
                token: expect.any(String),
            });
        });

        it('should register with valid username and password', async () => {
            const registerDto = {
                identifier: testUser.username,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                username: registerDto.identifier,
                token: expect.any(String),
            });
        });

        it('should register with valid phone number and password', async () => {
            const registerDto = {
                identifier: '989' + Math.floor(Math.random() * 1000000000).toString(),
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(200);

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                phone: registerDto.identifier,
                token: expect.any(String),
            });
        });

        it('should return 400 for already existing email', async () => {
            const registerDto = {
                identifier: testUser.email,
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode', 400);
        });

        it('should return 400 for empty identifier', async () => {
            const registerDto = {
                identifier: '',
                password: testUser.password,
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode', 400);
        });

        it('should return 400 for empty password', async () => {
            const registerDto = {
                identifier: testUser.email,
                password: '',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode', 400);
        });
    });
});
