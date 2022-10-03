import { Module } from '@nestjs/common';
import { ScoreTrackerController } from './score-tracker.controller';
import { ScoreTrackerService } from './score-tracker.service';

@Module({
  imports: [],
  providers: [ScoreTrackerService],
  controllers: [ScoreTrackerController],
  exports: [ScoreTrackerService],
})
export class ScoreTrackerModule {}
