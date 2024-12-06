import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
    @ApiProperty({
        description: 'The updated title of the task',
        example: 'Update the task title',
        required: false,
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: 'The updated description of the task',
        example: 'Make the task description more detailed',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The updated due date for the task',
        example: '2024-12-20T00:00:00Z',
        required: false,
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dueDate?: Date;

    @ApiProperty({
        description: 'The updated status of the task',
        example: 'completed',
        enum: ['pending', 'in_progress', 'completed'],
        required: false,
    })
    @IsEnum(['pending', 'in_progress', 'completed'])
    @IsOptional()
    status?: string;
}
