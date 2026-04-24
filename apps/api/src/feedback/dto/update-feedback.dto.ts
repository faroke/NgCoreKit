import { IsIn, IsOptional } from "class-validator";

export class UpdateFeedbackDto {
  @IsIn(["new", "read", "archived"])
  @IsOptional()
  status?: "new" | "read" | "archived";
}
