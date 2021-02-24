import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { INestApplication } from '@nestjs/common';

describe('GameService', () => {
  let service: GameService;
  let app: INestApplication;

  beforeAll(async () => {
    await app.init();
    console.log('!!!!!!!!!!!!', process.env.NODE_ENV);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
