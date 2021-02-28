import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { closeInMongodConnection, rootMongooseTestModule } from '../config/rootMongooseTestModule';
import { PublisherService } from './publisher.service';
import { Publisher, PublisherSchema } from './publisher.schema';
import { PublisherMapperService } from './publisher-mapper.service';
import { PublisherRepositoryService } from './publisher-repository.service';
import { PublisherDto } from './pubilsher-dto';

describe('publisherRepository', () => {
  let service: PublisherRepositoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }]),
      ],
      providers: [PublisherService, PublisherMapperService, PublisherRepositoryService],
    }).compile();

    service = module.get<PublisherRepositoryService>(PublisherRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('add publisher', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456789',
      siret: 123456,
    };

    // when
    const result = await service.add(publisherDto);

    // then
    expect(result._id).toBeDefined();
    expect(result.name).toEqual(publisherDto.name);
    expect(result.siret).toEqual(publisherDto.siret);
  });

  it('edit publisher', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456789',
      siret: 123456,
    };
    const publisherSaved = await service.add(publisherDto);
    publisherSaved.name = 'name updated';

    // when
    const result = await service.edit(publisherSaved);

    // then
    expect(result._id).toBeDefined();
    expect(result.name).toEqual(publisherSaved.name);
    expect(result.siret).toEqual(publisherSaved.siret);
  });

  it('get publisher', async () => {
    // given
    const publisherDto: PublisherDto = {
      name: 'publisher',
      phone: '123456789',
      siret: 123456,
    };
    const publisherSaved = await service.add(publisherDto);

    // when
    const result = await service.getById(publisherSaved._id);

    // then
    expect(result._id).toEqual(publisherSaved._id);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
