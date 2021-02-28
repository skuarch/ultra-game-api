import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { GameRepositoryService } from './game-repository.service';
import { Game, GameSchema } from './game-schema';

describe('gameRepository', () => {
  let service: GameRepositoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
      providers: [GameRepositoryService],
    }).compile();

    service = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
