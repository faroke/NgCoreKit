import { IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  review: number;

  @IsString()
  @MaxLength(2000)
  message: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
