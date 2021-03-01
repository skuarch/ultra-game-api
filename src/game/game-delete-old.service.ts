import { Injectable } from '@nestjs/common';
import { GameService } from './game-service';
import { EIGHTEEN_MONTHS } from '../constants/constants';

@Injectable()
export class GameDeleteOldService {
  constructor(private readonly gameService: GameService) {}

  async deleteOldGames(): Promise<void> {
    // get time to delete
    const date = new Date();
    date.setMonth(date.getMonth() - EIGHTEEN_MONTHS);

    // get old games
    const gameDocuments = await this.gameService.getOldGames(date);

    // get ids and bulk delete
    const ids = this.gameService.getIdsFromDocuments(gameDocuments);
    await this.gameService.deleteMany(ids);
  }
}
