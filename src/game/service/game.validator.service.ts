import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { GameRepositoryService } from './game.repository.service';
import { GameDocument } from '../schema/game.schema';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class GameValidatorService {
  private readonly ObjectId = mongoose.Types.ObjectId;
  constructor(private readonly gameRepository: GameRepositoryService) {}

  validateId(id: string): boolean {
    if (!id) {
      return false;
    }
    return mongoose.Types.ObjectId.isValid(id);
  }

  throwErrorIfIdIsInvalid(id: string) {
    const validation = this.validateId(id);
    if (!validation) {
      throw new HttpException('id is invalid', HttpStatus.BAD_REQUEST);
    }
  }

  throwErrorIfDocumentIsInValid(gameDocument: GameDocument) {
    if (!gameDocument) {
      throw new HttpException("gameDocument doesn't exists", HttpStatus.NOT_FOUND);
    }
  }

  throwErrorIfContainsId(id: string) {
    if (id) {
      throw new HttpException('id is defined, use update instead', HttpStatus.CONFLICT);
    }
  }

  async throwErrorIfDocumentExits(id: string): Promise<void> {
    if (id) {
      const gameDocument = await this.gameRepository.findById(id);
      if (gameDocument) {
        throw new HttpException('gameDocument exists', HttpStatus.FOUND);
      }
    }
  }

  async throwErrorIfDocumentDoesntExits(id: string): Promise<void> {
    if (id) {
      const gameDocument = await this.gameRepository.findById(id);
      if (!gameDocument) {
        throw new HttpException("gameDocument doesn't exists", HttpStatus.NOT_FOUND);
      }
    }
  }

  validateString(string: string): boolean {
    if (!string || string.length < 1 || string.trim().length < 1) {
      return false;
    }
    return true;
  }

  throwErrorIfStringIsNotValid(string: string) {
    if (!this.validateString(string)) {
      throw new HttpException('id is invalid', HttpStatus.BAD_REQUEST);
    }
  }

  async throwErrorIfGameTitleExits(title: string): Promise<void> {
    const gameDocument = await this.gameRepository.getGameDocumentByTitle(title);
    if (gameDocument) {
      throw new HttpException(`game ${title} already exists`, HttpStatus.FOUND);
    }
  }

  isMongoId(id: string) {
    return this.ObjectId.isValid(id) && id.match(/^[0-9a-fA-F]{24}$/);
  }

  throwErrorIfPriceIsNotValid(price: number) {
    if (price < 0) {
      console.log('entro aqui 1');
      throw new HttpException('price should be higher than 0', HttpStatus.BAD_REQUEST);
    }
    const regex = /^\d+(?:\.\d{0,2})$/;
    if (!regex.test(price.toString())) {
      console.log('entro aqui 2');
      throw new HttpException('price is not valid', HttpStatus.BAD_REQUEST);
    }
  }
}
