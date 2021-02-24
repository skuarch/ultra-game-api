import { Injectable } from '@nestjs/common';
import { PublisherDocument } from '../../publisher/schema/publisher.schema';
import { GameDto } from '../dto/game.dto.interface';
import { GameDocument } from '../schema/game.schema';
import { PublisherMapperService } from '../../publisher/service/publisher.mapper.service';

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
    const gameDto: GameDto = {
      _id: _id,
      price: price,
      releaseDate: releaseDate,
      tags: tags,
      title: title,
      publisher: this.publisherMapper.mapPublisherDocumentToDto(publisher),
    };
    return gameDto;
  }

  asignDtoValuesToDocument(gameDocument: GameDocument, gameDto: GameDto): GameDocument {
    return Object.assign(gameDocument, gameDto);
  }
}
