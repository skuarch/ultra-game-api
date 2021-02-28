import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { PublisherService } from './publisher.service';
import { Publisher, PublisherSchema } from './publisher.schema';
import { PublisherMapperService } from './publisher-mapper.service';
import { PublisherRepositoryService } from './publisher-repository.service';
import { PublisherDto } from './pubilsher-dto';
import { ValidationError } from '@nestjs/common';

describe('PublisherService', () => {
  let service: PublisherService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [PublisherService, PublisherMapperService, PublisherRepositoryService],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get publisher when dto hasnt id', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456789',
      siret: 123456,
    };

    // when
    const result = await service.createOrUpdatePublisherDocument(publisherDto);

    // then
    expect(result).toBeDefined();
    expect(result._id).toBeDefined();
  });

  it('get publisher when dto has id', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456789',
      siret: 123456,
    };
    const publisher = await service.createOrUpdatePublisherDocument(publisherDto);
    publisherDto._id = publisher._id;

    // when
    const result = await service.createOrUpdatePublisherDocument(publisherDto);

    // then
    expect(result).toBeDefined();
    expect(result._id).toBeDefined();
    expect(result._id).toEqual(publisher._id);
  });

  it('create publisher with no name (negative testing, name is required)', async () => {
    // given
    let e: ValidationError;
    const publisherDto: PublisherDto = {
      name: undefined,
      phone: '123456789',
      siret: 123456,
    };

    // when
    await service.createOrUpdatePublisherDocument(publisherDto).catch((error) => {
      e = error;
    });

    // then
    expect(e).toBeDefined();
  });

  it('create publisher with no siret (negative testing, siret is required)', async () => {
    // given
    let e: ValidationError;
    const publisherDto: PublisherDto = {
      name: 'theName',
      phone: '123456789',
      siret: undefined,
    };

    // when
    await service.createOrUpdatePublisherDocument(publisherDto).catch((error) => {
      e = error;
    });

    // then
    expect(e).toBeDefined();
  });

  it('create publisher with empty name (negative testing, name should be valid)', async () => {
    // given
    let e: any;
    const publisherDto: PublisherDto = {
      name: '',
      phone: '123456789',
      siret: undefined,
    };

    // when
    await service.createOrUpdatePublisherDocument(publisherDto).catch((error) => {
      e = error;
    });

    // then
    expect(e).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
