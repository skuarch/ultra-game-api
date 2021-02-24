import { Test, TestingModule } from '@nestjs/testing';
import { PublisherMapperService } from './publisher.mapper.service';
import { INestApplication } from '@nestjs/common';
import { PublisherModule } from '../publisher.module';
import { AppModule } from '../../app.module';
import { PublisherDocument } from '../schema/publisher.schema';

describe('PublisherMapperService', () => {
  let service: PublisherMapperService;
  let app: INestApplication;

  // -------------------------------------------------------------------
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, PublisherModule],
    })
      .overrideProvider(service)
      .useValue(service)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // -------------------------------------------------------------------
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublisherMapperService],
    }).compile();

    service = module.get<PublisherMapperService>(PublisherMapperService);
  });

  // -------------------------------------------------------------------
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  it('map publisher document to dto', () => {
    // given
    const publisherDocument = {
      _id: '123456789456123456',
      name: 'publisherName',
      phone: '123456789',
      siret: 123456789,
    } as PublisherDocument;

    // when
    const resutlDto = service.mapPublisherDocumentToDto(publisherDocument);

    // then
    expect(resutlDto._id).toEqual(publisherDocument._id);
    expect(resutlDto.name).toEqual(publisherDocument.name);
    expect(resutlDto.phone).toEqual(publisherDocument.phone);
    expect(resutlDto.siret).toEqual(publisherDocument.siret);
  });

  // -------------------------------------------------------------------
  it('map publisher document to dto with undefinied content', () => {
    // given
    const publisherDocument = {
      _id: undefined,
      name: undefined,
      phone: undefined,
      siret: undefined,
    } as PublisherDocument;

    // when
    const resutlDto = service.mapPublisherDocumentToDto(publisherDocument);

    // then
    expect(resutlDto._id).toEqual(publisherDocument._id);
    expect(resutlDto.name).toEqual(publisherDocument.name);
    expect(resutlDto.phone).toEqual(publisherDocument.phone);
    expect(resutlDto.siret).toEqual(publisherDocument.siret);
  });

  // -------------------------------------------------------------------
  it('map publisher document to dto with only name', () => {
    // given
    const publisherDocument = {
      _id: undefined,
    } as PublisherDocument;

    // when
    const resutlDto = service.mapPublisherDocumentToDto(publisherDocument);

    // then
    expect(resutlDto._id).toEqual(publisherDocument._id);
    expect(resutlDto.name).toBeFalsy();
    expect(resutlDto.phone).toBeFalsy();
    expect(resutlDto.siret).toBeFalsy();
  });

  // -------------------------------------------------------------------
  afterAll(async () => {
    await app.close();
  });
});
