import { IsIn } from "class-validator";

export class CreateCheckoutDto {
  @IsIn(["pro", "ultra"])
  plan!: "pro" | "ultra";

  @IsIn(["monthly", "yearly"])
  interval!: "monthly" | "yearly";
}
