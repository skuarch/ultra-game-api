import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameController } from './controller/game.controller';
import { GameRepositoryService } from './service/game.repository.service';
import { Game, GameSchema } from './schema/game.schema';
import { GameMapperService } from './service/game.mapper.service';
import { GameService } from './service/game.service';
import { GameValidatorService } from './service/game.validator.service';
import { PublisherModule } from '../publisher/publisher.module';
import { Publisher, PublisherSchema } from '../publisher/schema/publisher.schema';
import { DeleteOldGamesService } from './service/game.delete.old.service';
import { GameTaskService } from './service/game.task.service';
import { GameDiscountService } from './service/game.discount.service';

@Module({
  imports: [
    PublisherModule,
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
  ],
  controllers: [GameController],
  providers: [
    GameRepositoryService,
    GameMapperService,
    GameService,
    GameValidatorService,
    DeleteOldGamesService,
    GameTaskService,
    GameDiscountService,
  ],
  exports: [GameRepositoryService, GameMapperService, GameService, GameValidatorService],
})
export class GameModule {}
