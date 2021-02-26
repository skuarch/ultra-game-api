import { Injectable } from '@nestjs/common';
import { PublisherMapperService } from '../publisher/publisher-mapper.service';
import { PublisherRepositoryService } from '../publisher/publisher-repository.service';
import { PublisherValidatorService } from '../publisher/publisher-validator.service';
import { GameDto } from './game-dto';
import { GameMapperService } from './game-mapper.service';
import { GameRepositoryService } from './game-repository.service';
import { GameValidatorService } from './game-validator.service';

@Injectable()
export class GameUpdateService {
  constructor(
    private readonly gameValidator: GameValidatorService,
    private readonly gameRepository: GameRepositoryService,
    private readonly publisherValidator: PublisherValidatorService,
    private readonly gameMapper: GameMapperService,
    private readonly publisherRepository: PublisherRepositoryService,
    private readonly publisherMapper: PublisherMapperService,
  ) {}

  async updateGame(gameDto: GameDto): Promise<GameDto> {
    // validate game
    this.gameValidator.throwErrorIfIdIsInvalid(gameDto._id);
    let gameDocument = await this.gameRepository.getById(gameDto._id);
    this.gameValidator.throwErrorIfDocumentIsInvalid(gameDocument);

    // validate publisher
    this.publisherValidator.throwErrorIfIdIsInvalid(gameDto.publisher._id);
    let publisherDocument = await this.publisherRepository.getById(gameDto.publisher._id);
    this.publisherValidator.throwErrorIfDocumentIsInValid(publisherDocument);

    // map
    gameDocument = this.gameMapper.asignDtoValuesToDocument(gameDocument, gameDto);
    publisherDocument = this.publisherMapper.asignDtoValuesToDocument(publisherDocument, gameDto.publisher);

    // update game and publisher
    const updatedGameDocument = await this.gameRepository.edit(gameDocument);
    const updatedPublisherDocument = await this.publisherRepository.edit(publisherDocument);

    // return dto
    const updatedGameDto = this.gameMapper.mapGameAndPublisherDocumentToDto(
      updatedGameDocument,
      updatedPublisherDocument,
    );

    return updatedGameDto;
  }
}
