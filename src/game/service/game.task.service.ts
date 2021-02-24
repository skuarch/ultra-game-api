import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GameDiscountService } from './game.discount.service';
import { DeleteOldGamesService } from './game.delete.old.service';

@Injectable()
export class GameTaskService {
  constructor(
    private readonly deleteOldGameService: DeleteOldGamesService,
    private readonly gameDiscountService: GameDiscountService,
  ) {}

  // @Cron('01 00 * * *') // at midnigth
  @Cron('* * * * * *')
  async deleteOldGamesTask() {
    await this.deleteOldGameService.deleteOldGames();
  }

  // @Cron('01 00 * * *') // at midnigth
  @Cron('* * * * * *')
  async discountTask() {
    await this.gameDiscountService.discountByDateRange();
  }
}
