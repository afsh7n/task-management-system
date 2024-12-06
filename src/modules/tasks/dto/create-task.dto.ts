import { IsString, IsOptional, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        example: 'Complete the project',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'A brief description of the task',
        example: 'Finish the backend implementation by the end of the week',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The due date for the task',
        example: '2024-12-15T00:00:00Z',
        required: false,
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dueDate?: Date;
}
