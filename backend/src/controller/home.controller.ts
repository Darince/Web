import { Controller, Get } from '@midwayjs/core';

@Controller('/api')
export class HomeController {
  @Get('/hello')
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
