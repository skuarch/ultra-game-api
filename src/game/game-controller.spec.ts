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
import { GameDto } from './game-dto';
import { GameDeleteOldService } from './game-delete-old.service';
import { GameGetGameOrPublisherService } from './game-get-game-or-publisher.service';
import { GameController } from './game-controller';
import { GameUpdateService } from './game-update.service';
import { PublisherValidatorService } from '../publisher/publisher-validator.service';
import { GameDeleteService } from './game-delete.service';
import { PublisherDto } from '../publisher/pubilsher-dto';
import * as mongoose from 'mongoose';

describe('GameController', () => {
  let service: GameService;
  let controller: GameController;
  let gameRepository: GameRepositoryService;
  let publisherRepository: PublisherRepositoryService;
  const ObjectId = mongoose.Types.ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
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
        GameUpdateService,
        PublisherValidatorService,
        GameDeleteService,
        PublisherRepositoryService,
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    controller = module.get<GameController>(GameController);
    gameRepository = module.get<GameRepositoryService>(GameRepositoryService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('getGames, no games', async () => {
    // given
    // when
    const result = await controller.getGames();

    // then
    expect(result.length).toEqual(0);
  });

  it('getGames, at least one game', async () => {
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
    await gameRepository.add(gameDto);

    // when
    const result = await controller.getGames();

    // then
    expect(result.length).toEqual(1);
  });

  it('createGame', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'game title',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };

    // when
    const result = await controller.createGame(gameDto);

    // then
    expect(result._id).toBeDefined();
    expect(result.title).toEqual(gameDto.title);
  });

  it('createGame, publisher doesnt exits', async () => {
    // given
    let error: any;
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(), // not exists
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'new game',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };

    // when
    await controller.createGame(gameDto).catch((e) => {
      error = e;
    });

    // then
    expect(error).toBeDefined();
    expect(error.response).toBeDefined();
  });

  it('createGame, create wrong price', async () => {
    // given
    let error: any;
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(), // not exists
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'new game',
      price: '1000', // no decimals
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };

    // when
    await controller.createGame(gameDto).catch((e) => {
      error = e;
    });

    // then
    expect(error.status).toEqual(400);
    expect(error.response).toEqual('price is not valid');
  });

  it('createGame, game title duplicated', async () => {
    // given
    let error: any;
    const publisherDto: PublisherDto = {
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

    // when
    await controller.createGame(gameDto).catch((e) => {
      error = e;
    });

    // then
    expect(error).toBeDefined();
    expect(error.response).toEqual(`game: ${gameDto.title} already exists`);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
