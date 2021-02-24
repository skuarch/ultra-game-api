import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from '../schema/game.schema';
import { Model } from 'mongoose';
import { GameDto } from '../dto/game.dto.interface';
import { Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Injectable()
export class GameRepositoryService {
  private logger = new Logger('GameRepositoryService');

  constructor(@InjectModel(Game.name) private readonly gameModel: Model<GameDocument>) {}

  async create(gameDto: GameDto): Promise<GameDocument> {
    const createGame = new this.gameModel(gameDto);
    return createGame.save();
  }

  async getDocuments(): Promise<GameDocument[]> {
    return this.gameModel.find().populate('publisher', '-_id -__v').select('-__v -originalPrice -discountApplied');
  }

  async update(gameDocument: GameDocument): Promise<GameDocument> {
    const options = { new: true, useFindAndModify: false };
    const document = await this.gameModel.findByIdAndUpdate(gameDocument._id, gameDocument, options);

    if (!document) {
      throw new HttpException('gameDocument not found', HttpStatus.NOT_FOUND);
    }

    return document;
  }

  async findById(id: string): Promise<GameDocument> {
    const gameDocument = await this.gameModel.findById(id).populate('publisher', '-__v').exec();

    if (!gameDocument) {
      this.logger.warn(`gameDocument ${id} not found`);
    }

    return gameDocument;
  }

  async delete(id: string) {
    const deleteResult = await this.gameModel.deleteOne({ _id: id });
    return deleteResult;
  }

  async getGameDocumentByTitle(title: string): Promise<GameDocument> {
    const gameDocuments = await this.gameModel.find({ title: title }).populate('publisher', '-__v').exec();
    let gameDocument: GameDocument;

    if (gameDocuments && gameDocuments.length > 0) {
      gameDocument = gameDocuments[0];
    } else {
      this.logger.debug(`gameDocuments length is less than 1`);
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
    const query = { releaseDate: { $gte: startDate, $lte: endDate }, discountApplied: false };
    const gameDocuments = await this.gameModel.find(query).exec();
    return gameDocuments;
  }
}
