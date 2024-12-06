import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FilterTasksDto } from '../dto/filter-tasks.dto';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    const mockUser: UserEntity = {
        id: 1,
        username: 'TestUser',
        email: 'test@example.com',
        phone: null,
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
        token: 'mockToken',
    };

    const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Task description',
        status: 'OPEN',
        user: mockUser,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTasksService = {
        createTask: jest.fn().mockResolvedValue(mockTask),
        getTasks: jest.fn().mockResolvedValue([mockTask]),
        updateTask: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
        deleteTask: jest.fn().mockResolvedValue(undefined),
    };

    const mockAuthGuard = {
        canActivate: jest.fn(() => true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createTask', () => {
        it('should create and return a task', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'Test Task',
                description: 'Task description',
            };

            const result = await controller.createTask(createTaskDto, mockUser);

            expect(service.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual(mockTask);
        });
    });

    describe('getTasks', () => {
        it('should return tasks based on filters', async () => {
            const filterDto: FilterTasksDto = { status: 'OPEN', search: 'Test' };

            const result = await controller.getTasks(filterDto, mockUser);

            expect(service.getTasks).toHaveBeenCalledWith(filterDto, mockUser);
            expect(result).toEqual([mockTask]);
        });
    });

    describe('updateTask', () => {
        it('should update and return the task', async () => {
            const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

            const result = await controller.updateTask(1, updateTaskDto, mockUser);

            expect(service.updateTask).toHaveBeenCalledWith(1, updateTaskDto, mockUser);
            expect(result).toEqual({ ...mockTask, title: 'Updated Task' });
        });

        it('should throw NotFoundException if the task does not exist', async () => {
            jest.spyOn(service, 'updateTask').mockRejectedValue(new NotFoundException());

            await expect(controller.updateTask(1, {}, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', async () => {
            const result = await controller.deleteTask(1, mockUser);

            expect(service.deleteTask).toHaveBeenCalledWith(1, mockUser);
            expect(result).toBeUndefined();
        });

        it('should throw NotFoundException if the task does not exist', async () => {
            jest.spyOn(service, 'deleteTask').mockRejectedValue(new NotFoundException());

            await expect(controller.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});
