import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from '../schema/publisher.schema';
import { Model } from 'mongoose';
import { PublisherDto } from '../dto/publisher.dto.interface';
import { Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PublisherRepositoryService {
  private logger = new Logger('PublisherRepositoryService');
  constructor(@InjectModel(Publisher.name) private readonly publisherModel: Model<PublisherDocument>) {}

  async findById(id: string): Promise<PublisherDocument> {
    const publisherDocument = await this.publisherModel.findById(id).exec();

    if (!publisherDocument) {
      this.logger.warn(`publisherDocument ${id} not found`);
    }

    return publisherDocument;
  }

  async create(publisherDto: PublisherDto): Promise<PublisherDocument> {
    const createPublisher = new this.publisherModel(publisherDto);
    return createPublisher.save();
  }

  async update(publisherDocument: PublisherDocument): Promise<PublisherDocument> {
    const options = { new: true, useFindAndModify: false };
    const document = await this.publisherModel.findByIdAndUpdate(publisherDocument._id, publisherDocument, options);

    if (!document) {
      throw new HttpException('publisherDocument not found', HttpStatus.NOT_FOUND);
    }

    return document;
  }
}
