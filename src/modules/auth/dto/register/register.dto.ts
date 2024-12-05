import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The identifier (either username, email, or phone number) used for login.',
    type: String,
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
