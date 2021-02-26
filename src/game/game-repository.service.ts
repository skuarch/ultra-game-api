import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './game-schema';
import { Model } from 'mongoose';
import { GameDto } from './game-dto';

export class GameRepositoryService {
  constructor(@InjectModel(Game.name) private readonly gameModel: Model<GameDocument>) {}

  async add(gameDto: GameDto): Promise<GameDocument> {
    const createGame = new this.gameModel(gameDto);
    return createGame.save();
  }

  async getById(id: string): Promise<GameDocument> {
    return this.gameModel.findById(id).populate('publisher', '-__v').exec();
  }

  async edit(gameDocument: GameDocument): Promise<GameDocument> {
    const options = { new: true, useFindAndModify: false };
    return this.gameModel.findByIdAndUpdate(gameDocument._id, gameDocument, options);
  }

  async delete(id: string): Promise<any> {
    return this.gameModel.deleteOne({ _id: id });
  }
}
