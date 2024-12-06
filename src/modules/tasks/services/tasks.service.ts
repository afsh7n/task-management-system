import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UserEntity } from '../../user/entity/user.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { FilterTasksDto } from '../dto/filter-tasks.dto';
import {UserRole} from "../../user/enums/userRole.enums";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const task = this.taskRepository.create({
            ...createTaskDto,
            user,
            status: TaskStatus.OPEN,
        });
        return await this.taskRepository.save(task);
    }

    async getTasks(filterDto: FilterTasksDto, user: UserEntity): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');

        if (UserRole.ADMIN != user.role){
            query.where('task.userId = :userId', { userId: user.id });
        }

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(task.title LIKE :search OR task.description LIKE :search)',
                { search: `%${search}%` },
            );
        }

        return await query.getMany();
    }

    async updateTask(
        id: number,
        updateTaskDto: UpdateTaskDto,
        user: UserEntity,
    ): Promise<TaskEntity> {
        let task = null
        if (UserRole.ADMIN == user.role){
            task = await this.taskRepository.findOne({
                where: { id},
            });
        }else {
            task = await this.taskRepository.findOne({
                where: { id, user: { id: user.id } },
            });
        }

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        Object.assign(task, updateTaskDto);

        return await this.taskRepository.save(task);
    }

    async deleteTask(id: number, user: UserEntity): Promise<void> {
        let task = null
        if (UserRole.ADMIN == user.role){
            task = await this.taskRepository.findOne({
                where: { id},
            });
        }else {
            task = await this.taskRepository.findOne({
                where: { id, user: { id: user.id } },
            });
        }

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        await this.taskRepository.delete({ id });
    }
}
