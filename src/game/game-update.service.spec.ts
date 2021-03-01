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
import { GameUpdateService } from './game-update.service';
import { PublisherValidatorService } from '../publisher/publisher-validator.service';

describe('updateGame', () => {
  let service: GameUpdateService;
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
        PublisherValidatorService,
        GameUpdateService,
      ],
    }).compile();

    service = module.get<GameUpdateService>(GameUpdateService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
    gameRepository = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('update game', async () => {
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'theTitle',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;
    const savedGame = await gameRepository.add(gameDto);
    gameDto._id = savedGame._id;

    // when
    gameDto.title = 'update';
    const result = await service.updateGame(gameDto);

    // then
    expect(result.title).toEqual(gameDto.title);
  });

  it('update something that doesnt exits', async () => {
    // given
    let error: any;
    const gameDto: GameDto = {
      _id: ObjectId().toHexString(),
      title: 'theTitle',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: undefined,
    };

    // when
    await service.updateGame(gameDto).catch((e) => {
      error = e;
    });

    // then
    expect(error.response).toEqual("gameDocument doesn't exists");
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
