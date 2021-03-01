import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GameDeleteOldService } from './game-delete-old.service';
import { GameDiscountService } from './game-discount.service';

@Injectable()
export class GameTasksService {
  constructor(
    private deleteOldGamesService: GameDeleteOldService,
    private readonly gameDiscountService: GameDiscountService,
  ) {}

  // @Cron('01 00 * * *') // at midnigth
  @Cron('* * * * * *')
  async deleteOldGamesTask() {
    await this.deleteOldGamesService.deleteOldGames();
  }

  // @Cron('01 00 * * *') // at midnigth
  @Cron('* * * * * *')
  async discountTask() {
    await this.gameDiscountService.discountByDateRange();
  }
}
