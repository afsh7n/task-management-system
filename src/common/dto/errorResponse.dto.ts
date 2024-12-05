import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 400, description: 'HTTP status code' })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request', description: 'Error type or name' })
    error: string;

    @ApiProperty({ example: 'Invalid identifier or password.', description: 'Error message' })
    message: string;
}
