import { Test, TestingModule } from '@nestjs/testing';
import { GameRepositoryService } from './game.repository.service';
import { GameValidatorService } from './game.validator.service';

describe('GameValidatorService', () => {
  let service: GameValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRepositoryService, GameValidatorService],
    }).compile();

    service = module.get<GameValidatorService>(GameValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
