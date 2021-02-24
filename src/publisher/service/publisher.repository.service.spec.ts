import { Test, TestingModule } from '@nestjs/testing';
import { PublisherRepositoryService } from './publisher.repository.service';

describe('PublisherRepositoryService', () => {
  let service: PublisherRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublisherRepositoryService],
    }).compile();

    service = module.get<PublisherRepositoryService>(PublisherRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
