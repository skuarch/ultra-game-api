import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './game/game-controller';
import { Game, GameSchema } from './game/game-schema';
import { GameService } from './game/game-service';
import { GameRepositoryService } from './game/game-repository.service';
import { GameCreateService } from './game/game-create.service';
import { GameValidatorService } from './game/game-validator.service';
import { PublisherService } from './publisher/publisher.service';
import { PublisherMapperService } from './publisher/publisher-mapper.service';
import { PublisherRepositoryService } from './publisher/publisher-repository.service';
import { Publisher, PublisherSchema } from './publisher/publisher.schema';
import { GameMapperService } from './game/game-mapper.service';
import { GameUpdateService } from './game/game-update.service';
import { PublisherValidatorService } from './publisher/publisher-validator.service';
import { GameDeleteService } from './game/game-delete.service';
import { GameGetGameOrPublisherService } from './game/game-get-game-or-publisher.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfig } from './config/mongoose.config';
import { ScheduleModule } from '@nestjs/schedule';
import { GameTasksService } from './game/game-tasks.service';
import { GameDeleteOldService } from './game/game-delete-old.service';
import { GameDiscountService } from './game/game-discount.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
    ConfigModule.forRoot({
      envFilePath: `src/environment/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
  ],
  controllers: [AppController, GameController],
  providers: [
    AppService,
    GameRepositoryService,
    GameService,
    GameCreateService,
    GameValidatorService,
    PublisherService,
    PublisherMapperService,
    PublisherRepositoryService,
    GameMapperService,
    GameUpdateService,
    PublisherValidatorService,
    GameDeleteService,
    GameGetGameOrPublisherService,
    GameTasksService,
    GameDeleteOldService,
    GameDiscountService,
  ],
})
export class AppModule {}
