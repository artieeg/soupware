require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS],
    },
  });

  app.enableShutdownHooks();
  app.startAllMicroservices();

  app.listen(3000);
}
bootstrap();
