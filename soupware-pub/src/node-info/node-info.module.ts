import { Global, Module } from "@nestjs/common";
import { NodeInfoService } from "./node-info.service";

@Module({
  imports: [],
  providers: [NodeInfoService],
  controllers: [],
  exports: [NodeInfoService],
})
@Global()
export class NodeInfoModule {}
