import { Injectable } from '@nestjs/common';
import { GameService } from './game-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameDeleteOldService {
  constructor(private readonly gameService: GameService, private readonly configService: ConfigService) {}

  async deleteOldGames(): Promise<void> {
    // get time to delete
    const date = new Date();
    const oldGamesMonth = this.configService.get<number>('OLD_GAME_MONTHS');
    date.setMonth(date.getMonth() - oldGamesMonth);

    // get old games
    const gameDocuments = await this.gameService.getOldGames(date);

    // get ids and bulk delete
    const ids = this.gameService.getIdsFromDocuments(gameDocuments);
    await this.gameService.deleteMany(ids);
  }
}
