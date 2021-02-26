import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('BoostrapMain');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  logger.log(`Loading environment: ${process.env.NODE_ENV}`);
  config({ path: `../environment/${process.env.NODE_ENV}.env` });
  const configSwagger = new DocumentBuilder()
    .setTitle('Game API')
    .setDescription('manage games')
    .setVersion('0.0')
    .addTag('games')
    .addTag('publishers')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
