import { Test, TestingModule } from '@nestjs/testing';
import { GameDiscountService } from './game.discount.service';

describe('Game.DiscountService', () => {
  let service: GameDiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDiscountService],
    }).compile();

    service = module.get<GameDiscountService>(GameDiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
