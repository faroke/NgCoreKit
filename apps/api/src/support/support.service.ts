import { Injectable, Logger } from '@nestjs/common';
import { CreateSupportDto } from './dto/create-support.dto';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  create(dto: CreateSupportDto) {
    this.logger.log(`Support request from ${dto.email}: ${dto.subject}`);
    return { data: { message: 'Support request received. We will get back to you shortly.' } };
  }
}
