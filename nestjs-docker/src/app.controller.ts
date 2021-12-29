import { Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  postHello(): string {
    return this.appService.postHello();
  }

  @Get('test')
  getTest(): string {
    return this.appService.getTest();
  }
}
