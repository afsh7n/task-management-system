import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn} from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Exclude } from 'class-transformer';
import {TaskEntity} from "../../tasks/entities/task.entity";

@Entity('users')
export class UserEntity extends BaseEntity{
    @Column({ unique: true , nullable:true})
    username: string;

    @Column({ unique: true , nullable:true})
    email: string;

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

    token: string;

    @OneToMany(() => TaskEntity, (task) => task.user, { cascade: true })
    tasks: TaskEntity[];
}