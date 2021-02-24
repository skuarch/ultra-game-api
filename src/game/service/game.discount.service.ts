import { Injectable } from '@nestjs/common';
import { GameDocument } from '../schema/game.schema';
import { GameRepositoryService } from './game.repository.service';

@Injectable()
export class GameDiscountService {
  constructor(private readonly gameRepository: GameRepositoryService) {}

  async discountByDateRange() {
    // start date
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 18);

    // end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - 12);

    const gameDocuments = await this.gameRepository.getGamesByDateRange(startDate, endDate);
    gameDocuments.map((doc) => {
      const discount = (doc.price * 25) / 100;
      doc.price = doc.price - discount;
      doc.discountApplied = true;
    });

    const promises: Promise<GameDocument>[] = [];
    gameDocuments.forEach((doc) => {
      promises.push(this.gameRepository.update(doc));
    });

    Promise.all(promises);
  }
}
