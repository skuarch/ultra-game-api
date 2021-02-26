import { Injectable } from '@nestjs/common';
import { PublisherDocument } from '../publisher/publisher.schema';
import { GameDto } from './game-dto';
import { GameDocument } from './game-schema';
import { PublisherMapperService } from '../publisher/publisher-mapper.service';

@Injectable()
export class GameMapperService {
  constructor(private readonly publisherMapper: PublisherMapperService) {}

  mapGameAndPublisherDocumentToDto(game: GameDocument, publisherDocument: PublisherDocument): GameDto {
    const publisherDto = this.publisherMapper.mapPublisherDocumentToDto(publisherDocument);
    const gameDto = this.mapGameDocumentToDto(game);
    gameDto.publisher = publisherDto;
    return gameDto;
  }

  mapGameDocumentToDto(gameDocument: GameDocument): GameDto {
    const { _id, price, tags, releaseDate, title, publisher } = gameDocument;
    const publisherDto = this.publisherMapper.mapPublisherDocumentToDto(publisher);
    const gameDto = { _id, price, tags, releaseDate, title, publisher: publisherDto };
    return gameDto;
  }

  asignDtoValuesToDocument(gameDocument: GameDocument, gameDto: GameDto): GameDocument {
    return Object.assign(gameDocument, gameDto);
  }
}
