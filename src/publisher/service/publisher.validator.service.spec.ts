import { Test, TestingModule } from '@nestjs/testing';
import { PublisherValidatorService } from './publisher.validator.service';

describe('PublisherValidatorService', () => {
  let service: PublisherValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublisherValidatorService],
    }).compile();

    service = module.get<PublisherValidatorService>(PublisherValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
