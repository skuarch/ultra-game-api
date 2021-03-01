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
import { GameDiscountService } from './game-discount.service';

describe('gameDiscount', () => {
  let service: GameDiscountService;
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
        GameDiscountService,
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

    service = module.get<GameDiscountService>(GameDiscountService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
    gameRepository = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create a game with more than 1 year', async (done) => {
    // discount should be applied
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 12);
    const gameDto: GameDto = {
      title: 'theTitle',
      price: '1000.00',
      releaseDate: pastDate,
      tags: ['tag'],
      publisher: publisherDto,
    };
    const savedPublisher = await publisherRepository.add(publisherDto);
    publisherDto._id = savedPublisher._id;
    gameDto.publisher = publisherDto;
    const savedGame = await gameRepository.add(gameDto);

    // when
    await service.discountByDateRange();

    // then
    // we need to wait until discount is applied
    setTimeout(async () => {
      const gameDocument = await gameRepository.getById(savedGame._id);
      expect(gameDocument.discountApplied).toEqual(true);
      done();
    }, 30);
  });

  it('create a game with current date', async (done) => {
    // no discount game is new
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

    // when
    await service.discountByDateRange();

    // then
    // we need to wait until discount is applied
    setTimeout(async () => {
      const gameDocument = await gameRepository.getById(savedGame._id);
      expect(gameDocument.discountApplied).toEqual(false);
      done();
    }, 30);
  });

  afterAll(async () => {
    setTimeout(async () => {
      await closeInMongodConnection();
    }, 100);
  });
});
