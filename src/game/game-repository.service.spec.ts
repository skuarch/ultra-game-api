import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { GameRepositoryService } from './game-repository.service';
import { Game, GameSchema } from './game-schema';
import { GameDto } from './game-dto';
import { PublisherDto } from 'src/publisher/pubilsher-dto';
import * as mongoose from 'mongoose';
import { Publisher, PublisherSchema } from '../publisher/publisher.schema';

describe('gameRepository', () => {
  let service: GameRepositoryService;
  const ObjectId = mongoose.Types.ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [GameRepositoryService],
    }).compile();

    service = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('add game', async () => {
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

    // when
    const result = await service.add(gameDto);

    // then
    expect(result._id).toBeDefined();
    expect(result.title).toEqual(gameDto.title);
  });

  it('edit game', async () => {
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
    const savedGame = await service.add(gameDto);
    savedGame.title = 'update title';

    // when
    const result = await service.edit(savedGame);

    // then
    expect(result._id).toBeDefined();
    expect(result.title).toEqual(savedGame.title);
  });

  it('get game', async () => {
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
    const savedGame = await service.add(gameDto);

    // when
    const result = await service.getById(savedGame._id);

    // then
    expect(result._id).toBeDefined();
    expect(result._id).toEqual(savedGame._id);
  });

  it('delete game', async () => {
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
    const savedGame = await service.add(gameDto);

    // when
    const result = await service.delete(savedGame._id);
    const result2 = await service.getById(savedGame._id);

    // then
    expect(result2).toBeFalsy();
    expect(result).toBeTruthy();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
