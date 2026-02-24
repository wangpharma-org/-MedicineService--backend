import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): { message: string } {
    return {
      message:
        'This is the Product Service. It handles product management and related operations.',
    };
  }
}
