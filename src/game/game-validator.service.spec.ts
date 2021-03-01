import { Test, TestingModule } from '@nestjs/testing';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { GameRepositoryService } from './game-repository.service';
import { GameValidatorService } from './game-validator.service';
import { Game, GameSchema } from './game-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from '../publisher/publisher.schema';
import * as mongoose from 'mongoose';

describe('gameValidator', () => {
  let service: GameValidatorService;
  const ObjectId = mongoose.Types.ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [GameValidatorService, GameRepositoryService],
    }).compile();

    service = module.get<GameValidatorService>(GameValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate Id', () => {
    // given
    const id = ObjectId().toHexString();

    // when
    const result = service.validateId(id);

    // then
    expect(result).toEqual(true);
  });

  it('validate Id with undefinied value', () => {
    // given
    const id = undefined;

    // when
    const result = service.validateId(id);

    // then
    expect(result).toEqual(false);
  });

  it('validate Id with empty', () => {
    // given
    const id = '';

    // when
    const result = service.validateId(id);

    // then
    expect(result).toEqual(false);
  });

  it('validate Id with blanks', () => {
    // given
    const id = '    ';

    // when
    const result = service.validateId(id);

    // then
    expect(result).toEqual(false);
  });

  it('validate Id with null', () => {
    // given
    const id = null;

    // when
    const result = service.validateId(id);

    // then
    expect(result).toEqual(false);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
