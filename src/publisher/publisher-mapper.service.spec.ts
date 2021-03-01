import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { PublisherMapperService } from './publisher-mapper.service';
import { Publisher, PublisherSchema } from './publisher.schema';

describe('PublisherMapper', () => {
  let service: PublisherMapperService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [PublisherMapperService],
    }).compile();

    service = module.get<PublisherMapperService>(PublisherMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
