import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { FeedbackService } from "../../feedback/feedback.service";
import { UpdateFeedbackDto } from "../../feedback/dto/update-feedback.dto";

@UseGuards(AdminGuard)
@Controller("admin/feedback")
export class AdminFeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get()
  list(
    @Query("page") page = "1",
    @Query("limit") limit = "20",
    @Query("status") status?: string,
  ) {
    return this.feedbackService.list(
      Math.max(1, parseInt(page, 10) || 1),
      Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),
      status,
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, dto);
  }
}
