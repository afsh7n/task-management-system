import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from '../enums/task-status.enum';

describe('TasksService', () => {
    let service: TasksService;
    let taskRepository: any;

    const mockUser: UserEntity = {
        id: 1,
        username: 'TestUser',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
        phone: null,
        token: 'token',
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Task description',
        status: TaskStatus.OPEN,
        user: mockUser,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        taskRepository = {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            findOne: jest.fn().mockResolvedValue(mockTask),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            createQueryBuilder: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([mockTask]),
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(TaskEntity),
                    useValue: taskRepository,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createTask', () => {
        it('should create and save a task', async () => {
            const createTaskDto = { title: 'Test Task', description: 'Task description' };
            const result = await service.createTask(createTaskDto, mockUser);

            expect(taskRepository.create).toHaveBeenCalledWith({
                ...createTaskDto,
                user: mockUser,
                status: TaskStatus.OPEN,
            });
            expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
            expect(result).toEqual(mockTask);
        });
    });

    describe('getTasks', () => {
        it('should retrieve tasks based on filters', async () => {
            const filterDto = { status: TaskStatus.OPEN, search: 'Test' };
            const result = await service.getTasks(filterDto, mockUser);

            expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
            expect(result).toEqual([mockTask]);
        });

        it('should return all tasks when no filters are provided', async () => {
            const result = await service.getTasks({}, mockUser);

            expect(taskRepository.createQueryBuilder).toHaveBeenCalled();
            expect(result).toEqual([mockTask]);
        });
    });

    describe('updateTask', () => {
        it('should update a task', async () => {
            const updateTaskDto = { title: 'Updated Title', description: 'Updated Description' };
            taskRepository.save.mockResolvedValue({ ...mockTask, ...updateTaskDto });

            const result = await service.updateTask(1, updateTaskDto, mockUser);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, user: { id: mockUser.id } },
            });
            expect(taskRepository.save).toHaveBeenCalledWith({ ...mockTask, ...updateTaskDto });
            expect(result).toEqual({ ...mockTask, ...updateTaskDto });
        });

        it('should throw NotFoundException if task does not exist', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            await expect(service.updateTask(1, {}, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', async () => {
            const result = await service.deleteTask(1, mockUser);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, user: { id: mockUser.id } },
            });
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1 });
            expect(result).toBeUndefined();
        });

        it('should throw NotFoundException if task does not exist', async () => {
            taskRepository.findOne.mockResolvedValue(null);

            await expect(service.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});
