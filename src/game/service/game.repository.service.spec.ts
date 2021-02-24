import { Test, TestingModule } from '@nestjs/testing';
import { GameRepositoryService } from './game.repository.service';

describe('GameService', () => {
  let service: GameRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRepositoryService],
    }).compile();

    service = module.get<GameRepositoryService>(GameRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
