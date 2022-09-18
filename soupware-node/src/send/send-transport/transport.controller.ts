import { Controller } from '@nestjs/common';
import { SendTransportService } from './transport.service';

@Controller()
export class SendTransportController {
  constructor(private sendTransportService: SendTransportService) {}
}
