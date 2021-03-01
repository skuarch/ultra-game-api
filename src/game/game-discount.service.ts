import { Injectable } from '@nestjs/common';
import { GameDocument } from './game-schema';
import { GameRepositoryService } from './game-repository.service';
import { GameService } from './game-service';
import { EIGHTEEN_MONTHS, ONE_YEAR_MONTHS } from '../constants/constants';

@Injectable()
export class GameDiscountService {
  constructor(private readonly gameRepository: GameRepositoryService, private readonly gameService: GameService) {}

  async discountByDateRange() {
    // start date
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - EIGHTEEN_MONTHS);

    // end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - ONE_YEAR_MONTHS);

    const gameDocuments = await this.gameService.getGamesByDateRange(startDate, endDate);
    gameDocuments.map((doc) => {
      const priceNumber = parseFloat(doc.price);
      const discount = (priceNumber * 25) / 100;
      doc.price = (priceNumber - discount).toFixed(2);
      doc.discountApplied = true;
    });

    const promises: Promise<GameDocument>[] = [];
    gameDocuments.forEach((doc) => {
      promises.push(this.gameRepository.edit(doc));
    });

    Promise.all(promises);
  }
}
