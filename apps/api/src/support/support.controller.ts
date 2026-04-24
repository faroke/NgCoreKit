import { Body, Controller, Post } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateSupportDto) {
    return this.supportService.create(dto);
  }
}
