import { Test, TestingModule } from '@nestjs/testing';
import { DeleteOldGamesService } from './game.delete.old.service';

describe('Delete.Old.GamesService', () => {
  let service: DeleteOldGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteOldGamesService],
    }).compile();

    service = module.get<DeleteOldGamesService>(DeleteOldGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
