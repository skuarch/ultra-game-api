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

describe('gameValidator', () => {
  let service: GameCreateService;
  let publisherRepository: PublisherRepositoryService;
  const ObjectId = mongoose.Types.ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [
        GameRepositoryService,
        GameValidatorService,
        GameService,
        GameMapperService,
        PublisherMapperService,
        GameCreateService,
        PublisherService,
        PublisherRepositoryService,
      ],
    }).compile();

    service = module.get<GameCreateService>(GameCreateService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create game', async () => {
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

    // when
    const result = await service.createGame(gameDto);

    // then
    expect(result).toBeDefined();
    expect(result.title).toEqual(gameDto.title);
  });

  it('create game twice with same title', async () => {
    // game name should be unique
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'theTitle1',
      price: '1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;

    // when
    let error: any;
    await service.createGame(gameDto);
    await service.createGame(gameDto).catch((e) => {
      error = e;
    });

    // then
    expect(error).toBeDefined();
    expect(error.response).toEqual(`game: ${gameDto.title} already exists`);
    expect(error.status).toEqual(302);
  });

  it('create game with 0.00', async () => {
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'theTitle0.00',
      price: '0.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;

    // when
    const result = await service.createGame(gameDto);

    // then
    expect(result).toBeDefined();
  });

  it('create game with invalid publisher', async () => {
    // given
    let error: any;
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
    gameDto.publisher = publisherDto;

    // when
    await service.createGame(gameDto).catch((e) => (error = e));

    // then
    expect(error).toBeDefined();
  });

  it('create game bad price', async () => {
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'theTitle',
      price: '1000', // price should be 1000.00 with decimals
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;

    // when
    let error: any;
    await service.createGame(gameDto).catch((e) => (error = e));

    // then
    expect(error).toBeDefined();
  });

  it('create game negative price', async () => {
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const gameDto: GameDto = {
      title: 'theTitle',
      price: '-1000.00',
      releaseDate: new Date(),
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;

    // when
    let error: any;
    await service.createGame(gameDto).catch((e) => (error = e));

    // then
    expect(error).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
