import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publisher, PublisherDocument } from './publisher.schema';
import { Model } from 'mongoose';
import { PublisherDto } from './pubilsher-dto';
import { Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PublisherRepositoryService {
  private logger = new Logger('PublisherRepositoryService');
  constructor(
    @InjectModel(Publisher.name)
    private readonly publisherModel: Model<PublisherDocument>,
  ) {}

  async getById(id: string): Promise<PublisherDocument> {
    const publisherDocument = await this.publisherModel.findById(id).exec();

    if (!publisherDocument) {
      this.logger.warn(`publisherDocument ${id} not found`);
    }

    return publisherDocument;
  }

  async add(publisherDto: PublisherDto): Promise<PublisherDocument> {
    const createPublisher = new this.publisherModel(publisherDto);
    return createPublisher.save();
  }

  async edit(publisherDocument: PublisherDocument): Promise<PublisherDocument> {
    const options = { new: true, useFindAndModify: false };
    const document = await this.publisherModel.findByIdAndUpdate(publisherDocument._id, publisherDocument, options);

    if (!document) {
      throw new HttpException('publisherDocument not found', HttpStatus.NOT_FOUND);
    }

    return document;
  }
}
