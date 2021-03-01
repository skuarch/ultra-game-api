import { Test, TestingModule } from '@nestjs/testing';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { Game, GameSchema } from './game-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from '../publisher/publisher.schema';
import { GameCreateService } from './game-create.service';
import { GameValidatorService } from './game-validator.service';
import { GameRepositoryService } from './game-repository.service';
import { GameService } from './game-service';
import { GameMapperService } from './game-mapper.service';
import { PublisherMapperService } from '../publisher/publisher-mapper.service';
import { PublisherService } from '../publisher/publisher.service';
import { PublisherRepositoryService } from '../publisher/publisher-repository.service';
import * as mongoose from 'mongoose';
import { PublisherDto } from '../publisher/pubilsher-dto';
import { GameDto } from './game-dto';
import { GameDeleteOldService } from './game-delete-old.service';
import { GameGetGameOrPublisherService } from './game-get-game-or-publisher.service';

describe('deleteGame', () => {
  let service: GameService;
  let publisherRepository: PublisherRepositoryService;
  let gameRepository: GameRepositoryService;
  const ObjectId = mongoose.Types.ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [
        GameDeleteOldService,
        GameRepositoryService,
        GameValidatorService,
        GameService,
        GameMapperService,
        PublisherMapperService,
        GameCreateService,
        PublisherService,
        PublisherRepositoryService,
        GameGetGameOrPublisherService,
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
    gameRepository = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getGames', async () => {
    // given
    // when
    const result = await service.getDocuments();

    // then
    expect(result.length).toEqual(0);
  });

  it('getGames', async () => {
    // given
    const gameDto: GameDto = {
      title: 'hello',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: undefined,
    };
    await gameRepository.add(gameDto);

    // when
    const result = await service.getDocuments();

    // then
    expect(result.length).toEqual(1);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
