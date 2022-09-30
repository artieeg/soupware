import { Injectable } from "@nestjs/common";
import TypedEmitter, { EventMap } from "typed-emitter";
import EventEmitter from "events";

// ⚠️  Beware of hacks ahead 🙃

@Injectable()
export class TypedEmitterService<T extends EventMap> {
  private emitter: TypedEmitter<T>;

  constructor() {
    this.emitter = new EventEmitter() as TypedEmitter<T>;
  }

  once: TypedEmitter<T>["once"] = (...args) => this.emitter.once(...args);

  on: TypedEmitter<T>["on"] = (...args) => this.emitter.on(...args);

  emit: TypedEmitter<T>["emit"] = (...args) => {
    return this.emitter.emit(...args);
  };
}
