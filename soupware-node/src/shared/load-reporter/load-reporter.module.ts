import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BandwidthTrackerModule } from '../bandwidth-tracker';
import { LoadReporterService } from './load-reporter.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORCHESTRATOR',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS],
        },
      },
    ]),
    BandwidthTrackerModule,
  ],
  providers: [LoadReporterService],
  controllers: [],
  exports: [LoadReporterService],
})
export class LoadReporterModule {}
