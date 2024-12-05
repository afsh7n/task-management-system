import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) {}

  async findWithUsername(username: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('user_not_found_with_username');
    }
    return user;
  }

  async findWithEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('user_not_found_with_email');
    }
    return user;
  }

  async findWithPhone(phone: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('user_not_found_with_phone');
    }
    return user;
  }

  async createWithUsername(username: string, password: string): Promise<UserEntity> {
    const user: UserEntity = this.usersRepository.create({
      username,
      password,
    });
    return await this.usersRepository.save(user);
  }

  async createWithEmail(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = this.usersRepository.create({
      email,
      password,
    });
    return await this.usersRepository.save(user);
  }

  async createWithPhone(phone: string, password: string): Promise<UserEntity> {
    const user: UserEntity = this.usersRepository.create({
      phone,
      password,
    });
    return await this.usersRepository.save(user);
  }
}
