import { Module, Global } from "@nestjs/common";
import { TypedEmitterService } from "./event-emitter.service";

@Module({
  imports: [],
  providers: [TypedEmitterService],
  controllers: [],
  exports: [TypedEmitterService],
})
@Global()
export class TypedEmitterModule {}
