import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './game-schema';
import { Logger } from '@nestjs/common';
import { GameValidatorService } from './game-validator.service';
import { GameRepositoryService } from './game-repository.service';
import { GameMapperService } from './game-mapper.service';
import { GameDto } from './game-dto';
import { PublisherDto } from '../publisher/pubilsher-dto';

@Injectable()
export class GameService {
  private logger = new Logger('GameRepositoryService');

  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
    private readonly gameValidator: GameValidatorService,
    private readonly gameRepository: GameRepositoryService,
    private readonly gameMapper: GameMapperService,
  ) {}

  async getDocuments(): Promise<GameDocument[]> {
    return this.gameModel
      .find()
      .populate('publisher', '-__v -createdAt -updatedAt')
      .select('-__v -originalPrice -discountApplied -createdAt -updatedAt');
  }

  async getGameDocumentByTitle(title: string): Promise<GameDocument> {
    const gameDocuments = await this.gameModel.find({ title: title }).populate('publisher', '-__v').exec();
    let gameDocument: GameDocument;

    if (gameDocuments && gameDocuments.length > 0) {
      gameDocument = gameDocuments[0];
    } else {
      this.logger.debug('gameDocuments length is less than 1');
    }

    return gameDocument;
  }

  async getOldGames(date: Date): Promise<GameDocument[]> {
    const gameDocuments = await this.gameModel.find({ releaseDate: { $lte: date } }).exec();
    return gameDocuments;
  }

  async deleteMany(ids: string[]): Promise<any> {
    return await this.gameModel.deleteMany({ _id: { $in: ids } });
  }

  async getGamesByDateRange(startDate: Date, endDate: Date): Promise<GameDocument[]> {
    const query = {
      releaseDate: { $gte: startDate, $lte: endDate },
      discountApplied: false,
    };

    const gameDocuments = await this.gameModel.find(query).exec();
    return gameDocuments;
  }

  async getGameDtoById(id: string): Promise<GameDto> {
    // validate
    this.gameValidator.throwErrorIfIdIsInvalid(id);
    await this.gameValidator.throwErrorIfDocumentDoesntExists(id);

    // get
    const gameDocument = await this.gameRepository.getById(id);

    // return dto
    const gameDto = this.gameMapper.mapGameDocumentToDto(gameDocument);
    return gameDto;
  }

  async getPublisherDtoByGameTitle(title: string): Promise<PublisherDto> {
    // validate title
    this.gameValidator.throwErrorIfStringIsNotValid(title);

    // get gameDocument
    const gameDocument = await this.getGameDocumentByTitle(title);

    // validate if document exits
    this.gameValidator.throwErrorIfDocumentIsInvalid(gameDocument);

    // map
    const gameDto = this.gameMapper.mapGameDocumentToDto(gameDocument);
    const publisherDto: PublisherDto = gameDto.publisher;

    return publisherDto;
  }

  async throwErrorIfGameTitleExists(title: string): Promise<void> {
    const gameDocument = await this.getGameDocumentByTitle(title);
    if (gameDocument) {
      throw new HttpException(`game ${title} already exists`, HttpStatus.FOUND);
    }
  }
}
