import { Module } from "@nestjs/common";
import { TypedEmitterService } from "./event-emitter.service";

@Module({
  imports: [],
  providers: [TypedEmitterService],
  controllers: [],
  exports: [TypedEmitterService],
})
export class TypedEmitterModule {}
