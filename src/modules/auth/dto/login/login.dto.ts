import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The identifier (username, email, or phone number). Must be a valid format.',
    type: String,
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'The password associated with the account.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
