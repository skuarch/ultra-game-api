import { Test } from '@nestjs/testing';
import { GameMapperService } from './game.mapper.service';
import { PublisherMapperService } from '../../publisher/service/publisher.mapper.service';
import { PublisherDocument } from '../../publisher/schema/publisher.schema';
import { GameDocument } from '../schema/game.schema';
import { GameDto } from '../dto/game.dto.interface';

describe('GameMapperService', () => {
  let service: GameMapperService;

  // -------------------------------------------------------------------
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PublisherMapperService, GameMapperService],
    }).compile();

    service = module.get<GameMapperService>(GameMapperService);
  });

  // -------------------------------------------------------------------
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------
  it('map documents to dto', () => {
    // given
    const publisherDocument = {
      _id: '123456789456123456',
      name: 'publisherName',
      phone: '123456789',
      siret: 123456789,
    } as PublisherDocument;

    const gameDocument = {
      title: 'title',
      price: 123,
      publisher: publisherDocument,
      tags: [''],
      releaseDate: new Date(),
    } as GameDocument;

    // when
    const result = service.mapGameAndPublisherDocumentToDto(gameDocument, publisherDocument);

    // then
    expect(result).toBeDefined();
    expect(result.price).toEqual(gameDocument.price);
    expect(result.publisher.name).toEqual(gameDocument.publisher.name);
  });

  // -------------------------------------------------------------------
  it('asign dto values to document', () => {
    // given
    const publisherDocument = {
      _id: '123456789456123456',
      name: 'publisherName',
      phone: '123456789',
      siret: 123456789,
    } as PublisherDocument;

    const gameDocument = {
      title: 'title',
      price: 123,
      publisher: publisherDocument,
      tags: [''],
      releaseDate: new Date(),
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
