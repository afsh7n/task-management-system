import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('tasks')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ default: 'pending' }) // 'pending', 'in_progress', 'completed'
    status: string;

    @ManyToOne(() => UserEntity, (user) => user.tasks, { eager: true })
    user: UserEntity;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
