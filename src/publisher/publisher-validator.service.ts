import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { PublisherDocument } from './publisher.schema';

@Injectable()
export class PublisherValidatorService {
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

  throwErrorIfDocumentIsInValid(publisherDocument: PublisherDocument) {
    if (!publisherDocument) {
      throw new HttpException('publisherDocument not found', HttpStatus.NOT_FOUND);
    }
  }
}
