import { Injectable } from '@nestjs/common';
import { PublisherService } from '../publisher/publisher.service';
import { GameDto } from './game-dto';
import { GameMapperService } from './game-mapper.service';
import { GameRepositoryService } from './game-repository.service';
import { GameService } from './game-service';
import { GameValidatorService } from './game-validator.service';

@Injectable()
export class GameCreateService {
  constructor(
    private readonly gameRepository: GameRepositoryService,
    private readonly gameValidator: GameValidatorService,
    private readonly publisherService: PublisherService,
    private readonly gameMapper: GameMapperService,
    private readonly gameService: GameService,
  ) {}

  async createGame(gameDto: GameDto): Promise<GameDto> {
    // new objects doesn't require id
    this.gameValidator.throwErrorIfIdIsValid(gameDto._id);

    // check price
    this.gameValidator.throwErrorIfPriceIsNotValid(gameDto.price);

    // game name should be unique
    await this.gameService.throwErrorIfGameTitleExists(gameDto.title);

    // if publisher exists update it, otherwise create it
    const publisherDocument = await this.publisherService.createOrUpdatePublisherDocument(gameDto.publisher);

    // create game
    gameDto.publisher._id = publisherDocument._id;
    gameDto.originalPrice = gameDto.price;
    const gameDocument = await this.gameRepository.add(gameDto);

    // return dto
    return this.gameMapper.mapGameAndPublisherDocumentToDto(gameDocument, publisherDocument);
  }
}
