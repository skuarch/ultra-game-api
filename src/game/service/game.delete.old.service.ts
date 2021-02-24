import { Injectable } from '@nestjs/common';
import { GameRepositoryService } from './game.repository.service';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeleteOldGamesService {
  constructor(
    private readonly gameRepository: GameRepositoryService,
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {}

  async deleteOldGames(): Promise<void> {
    // get time to delete
    const date = new Date();
    const oldGamesMonth = this.configService.get<number>('OLD_GAME_MONTHS');
    date.setMonth(date.getMonth() - oldGamesMonth);

    // get old games
    const gameDocuments = await this.gameRepository.getOldGames(date);

    // get ids and bulk delete
    const ids = this.gameService.getIdsFromDocuments(gameDocuments);
    await this.gameRepository.deleteMany(ids);
  }
}
