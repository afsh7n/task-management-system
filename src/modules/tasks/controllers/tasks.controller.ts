import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Patch,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { FilterTasksDto } from '../dto/filter-tasks.dto';
import { UserEntity } from '../../user/entity/user.entity';
import {AuthGuard} from "@nestjs/passport";
import {User} from "../../auth/decorators/user.decorator";
import {UserRole} from "../../user/enums/userRole.enums";

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({ type: CreateTaskDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The task has been successfully created.',
        type: TaskEntity,
    })
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @User() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get tasks with optional filters' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by task status' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by title or description' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of tasks retrieved successfully.',
        type: [TaskEntity],
    })
    getTasks(
        @Query() filterDto: FilterTasksDto,
        @User() user: UserEntity,
    ): Promise<TaskEntity[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update an existing task' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The task has been successfully updated.',
        type: TaskEntity,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Task not found.',
    })
    updateTask(
        @Param('id') id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @User() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.updateTask(id, updateTaskDto, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a task' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'The task has been successfully deleted.',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Task not found.',
    })
    deleteTask(@Param('id') id: number, @User() user: UserEntity): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
