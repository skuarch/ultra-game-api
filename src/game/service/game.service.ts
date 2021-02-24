import { Injectable } from '@nestjs/common';
import { GameDto } from '../dto/game.dto.interface';
import { GameMapperService } from './game.mapper.service';
import { GameRepositoryService } from './game.repository.service';
import { PublisherRepositoryService } from '../../publisher/service/publisher.repository.service';
import { GameValidatorService } from './game.validator.service';
import { PublisherValidatorService } from '../../publisher/service/publisher.validator.service';
import { PublisherMapperService } from '../../publisher/service/publisher.mapper.service';
import { PublisherService } from '../../publisher/service/publisher.service';
import { PublisherDto } from '../../publisher/dto/publisher.dto.interface';
import { GameDocument } from '../schema/game.schema';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepositoryService,
    private readonly gameMapper: GameMapperService,
    private readonly publisherRepository: PublisherRepositoryService,
    private readonly gameValidator: GameValidatorService,
    private readonly publisherValidator: PublisherValidatorService,
    private readonly publisherMapper: PublisherMapperService,
    private readonly publisherService: PublisherService,
  ) {}

  async saveGame(gameDto: GameDto): Promise<GameDto> {
    // new objects doesn't require id
    this.gameValidator.throwErrorIfContainsId(gameDto._id);

    // check price
    this.gameValidator.throwErrorIfPriceIsNotValid(gameDto.price);

    // validate if game title exits
    await this.gameValidator.throwErrorIfGameTitleExists(gameDto.title);

    // if publisher exists update it, otherwise create it
    const publisherDocument = await this.publisherService.createOrUpdatePublisherDocument(gameDto.publisher);

    // create game
    gameDto.publisher._id = publisherDocument._id;
    gameDto.originalPrice = gameDto.price;
    const gameDocument = await this.gameRepository.create(gameDto);

    // return dto
    return this.gameMapper.mapGameAndPublisherDocumentToDto(gameDocument, publisherDocument);
  }

  async getGames(): Promise<GameDto[]> {
    const gameDocuments = await this.gameRepository.getDocuments();
    return gameDocuments;
  }

  async updateGame(gameDto: GameDto): Promise<GameDto> {
    // validate game
    this.gameValidator.throwErrorIfIdIsInvalid(gameDto._id);
    let gameDocument = await this.gameRepository.findById(gameDto._id);
    this.gameValidator.throwErrorIfDocumentIsInValid(gameDocument);

    // validate publisher
    this.publisherValidator.throwErrorIfIdIsInvalid(gameDto.publisher._id);
    let publisherDocument = await this.publisherRepository.findById(gameDto.publisher._id);
    this.publisherValidator.throwErrorIfDocumentIsInValid(publisherDocument);

    // map
    gameDocument = this.gameMapper.asignDtoValuesToDocument(gameDocument, gameDto);
    publisherDocument = this.publisherMapper.asignDtoValuesToDocument(publisherDocument, gameDto.publisher);

    // update game and publisher
    const updatedGameDocument = await this.gameRepository.update(gameDocument);
    const updatedPublisherDocument = await this.publisherRepository.update(publisherDocument);

    // return dto
    const updatedGameDto = this.gameMapper.mapGameAndPublisherDocumentToDto(
      updatedGameDocument,
      updatedPublisherDocument,
    );

    return updatedGameDto;
  }

  async deleteGame(id: string): Promise<any> {
    // validate id
    this.gameValidator.throwErrorIfIdIsInvalid(id);

    // exits?
    await this.gameValidator.throwErrorIfDocumentDoesntExists(id);

    // delete
    return this.gameRepository.delete(id);
  }

  async getPublisherDtoByGameTitle(title: string): Promise<PublisherDto> {
    // validate title
    this.gameValidator.throwErrorIfStringIsNotValid(title);

    // get gameDocument
    const gameDocument = await this.gameRepository.getGameDocumentByTitle(title);

    // map
    const gameDto = this.gameMapper.mapGameDocumentToDto(gameDocument);
    const publisherDto: PublisherDto = gameDto.publisher;

    return publisherDto;
  }

  getIdsFromDocuments(gameDocuments: GameDocument[]) {
    return gameDocuments.map((doc) => doc._id);
  }

  async getGameDtoById(id: string): Promise<GameDto> {
    // validate
    this.gameValidator.throwErrorIfIdIsInvalid(id);
    await this.gameValidator.throwErrorIfDocumentDoesntExists(id);

    // get
    const gameDocument = await this.gameRepository.findById(id);

    // return dto
    const gameDto = this.gameMapper.mapGameDocumentToDto(gameDocument);
    return gameDto;
  }

  async getGetGameOrPublisher(param: string): Promise<any> {
    // check if param id is mongo id or game title
    if (this.gameValidator.isMongoId(param)) {
      return await this.getGameDtoById(param);
    } else {
      return await this.getPublisherDtoByGameTitle(param);
    }
  }
}
