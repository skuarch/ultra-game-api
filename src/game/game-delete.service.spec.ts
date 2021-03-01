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
import { EIGHTEEN_MONTHS } from '../constants/constants';
import { GameDeleteService } from './game-delete.service';

describe('deleteGame', () => {
  let service: GameDeleteService;
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
        GameDeleteService,
      ],
    }).compile();

    service = module.get<GameDeleteService>(GameDeleteService);
    publisherRepository = module.get<PublisherRepositoryService>(PublisherRepositoryService);
    gameRepository = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('delete game', async (done) => {
    // given
    const publisherDto: PublisherDto = {
      _id: ObjectId().toHexString(),
      name: 'publisher',
      phone: '123456',
      siret: 12345,
    };

    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - EIGHTEEN_MONTHS);
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
    await service.deleteGame(savedGame._id);

    // then
    // we need to wait until delete is applied
    setTimeout(async () => {
      const gameDocument = await gameRepository.getById(savedGame._id);
      expect(gameDocument).toBeFalsy();
      done();
    }, 30);
  });

  it('delete something that doesnt exits', async () => {
    // given
    let error: any;
    const _id = ObjectId().toHexString();

    // when
    await service.deleteGame(_id).catch((e) => {
      error = e;
    });

    // then
    expect(error.response).toEqual(`gameDocument ${_id} doesn't exists`);
  });

  afterAll(async () => {
    setTimeout(async () => {
      await closeInMongodConnection();
    }, 100);
  });
});
