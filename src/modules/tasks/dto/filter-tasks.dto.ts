import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterTasksDto {
    @ApiProperty({
        description: 'Filter tasks by status',
        example: 'pending',
        enum: ['pending', 'in_progress', 'completed'],
        required: false,
    })
    @IsEnum(['pending', 'in_progress', 'completed'])
    @IsOptional()
    status?: string;

    @ApiProperty({
        description: 'Search tasks by title or description',
        example: 'project',
        required: false,
    })
    @IsOptional()
    search?: string;
}
