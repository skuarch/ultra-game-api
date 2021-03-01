import { Injectable } from '@nestjs/common';
import { GameRepositoryService } from './game-repository.service';
import { GameValidatorService } from './game-validator.service';

@Injectable()
export class GameDeleteService {
  constructor(
    private readonly gameValidator: GameValidatorService,
    private readonly gameRepository: GameRepositoryService,
  ) {}

  async deleteGame(id: string): Promise<any> {
    // validate id
    this.gameValidator.throwErrorIfIdIsInvalid(id);

    // exits?
    await this.gameValidator.throwErrorIfDocumentDoesntExists(id);

    // delete
    return this.gameRepository.delete(id);
  }
}
