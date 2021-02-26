import { Injectable } from '@nestjs/common';
import { GameService } from './game-service';
import { GameValidatorService } from './game-validator.service';

@Injectable()
export class GameGetGameOrPublisherService {
  constructor(private readonly gameValidator: GameValidatorService, private readonly gameService: GameService) {}

  async getGetGameOrPublisher(param: string): Promise<any> {
    // check if param id is mongo id or game title
    if (this.gameValidator.isMongoId(param)) {
      return await this.gameService.getGameDtoById(param);
    } else {
      return await this.gameService.getPublisherDtoByGameTitle(param);
    }
  }
}
