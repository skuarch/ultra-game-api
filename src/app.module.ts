import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from './game/game.module';
import { MongooseConfig } from './config/mongoose.config';
import { PublisherModule } from './publisher/publisher.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    ConfigModule.forRoot({
      envFilePath: `src/environment/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    GameModule,
    PublisherModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
