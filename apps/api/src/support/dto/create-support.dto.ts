import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  subject: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  @IsEmail()
  email: string;
}
