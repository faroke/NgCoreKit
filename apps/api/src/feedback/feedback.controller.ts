import { Body, Controller, Post } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { CurrentUser, type AuthenticatedUser } from "../auth/decorators/current-user.decorator";

@Controller("feedback")
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto, @CurrentUser() user: AuthenticatedUser) {
    return this.feedbackService.create(dto, user?.id);
  }
}
