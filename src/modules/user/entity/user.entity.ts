import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Exclude } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

@Entity('users')
export class UserEntity extends BaseEntity{
    @Column({ unique: true , nullable:true})
    username: string;

    @ApiProperty({ description: 'User Email', example: 'test@example.com'  })
    @Column({ unique: true , nullable:true})
    email: string;

    @ApiProperty({ description: 'User phone', example: 1 })
    @Column({ unique: true , nullable:true})
    phone: string;

    @Column()
    @Exclude()
    password?: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'User token', example: 'jwt-token' })
    token: string;
}