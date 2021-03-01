import { Test } from '@nestjs/testing';
import { GameMapperService } from './game-mapper.service';
import { PublisherMapperService } from '../publisher/publisher-mapper.service';
import { PublisherDocument } from '../publisher/publisher.schema';
import { GameDocument } from './game-schema';
import { GameDto } from './game-dto';

describe('GameMapperService', () => {
  let service: GameMapperService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PublisherMapperService, GameMapperService],
    }).compile();

    service = module.get<GameMapperService>(GameMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('map documents to dto', () => {
    // given
    const publisherDocument = {
      _id: '123456789456123456',
      name: 'publisherName',
      phone: '123456789',
      siret: 123456789,
    } as PublisherDocument;

    const gameDocument = {
      title: '',
      publisher: publisherDocument,
      price: '',
      releaseDate: new Date(),
      tags: [''],
    } as GameDocument;

    // when
    const result = service.mapGameAndPublisherDocumentToDto(gameDocument, publisherDocument);

    // then
    expect(result).toBeDefined();
    expect(result.price).toEqual(gameDocument.price);
    expect(result.publisher.name).toEqual(gameDocument.publisher.name);
  });

  it('asign dto values to document', () => {
    // given
    const publisherDocument = {
      _id: '123456789456123456',
      name: 'publisherName',
      phone: '123456789',
      siret: 123456789,
    } as PublisherDocument;

    const gameDocument = {
      title: '',
      publisher: publisherDocument,
      price: '',
      releaseDate: new Date(),
      tags: [''],
    } as GameDocument;
    const gameDto: GameDto = {} as GameDto;

    // when
    const result = service.asignDtoValuesToDocument(gameDocument, gameDto);

    // then
    expect(result).toBeDefined();
    expect(result.price).toEqual(gameDocument.price);
    expect(result.publisher.name).toEqual(gameDocument.publisher.name);
  });
});
