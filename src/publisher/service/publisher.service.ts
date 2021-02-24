import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublisherDto } from '../dto/publisher.dto.interface';
import { PublisherMapperService } from './publisher.mapper.service';
import { PublisherRepositoryService } from './publisher.repository.service';
import { PublisherDocument } from '../schema/publisher.schema';

@Injectable()
export class PublisherService {
  constructor(
    private readonly publisherRepository: PublisherRepositoryService,
    private readonly publisherMapper: PublisherMapperService,
  ) {}

  async createOrUpdatePublisherDocument(publisherDto: PublisherDto): Promise<PublisherDocument> {
    let publisherDocument: PublisherDocument;

    if (publisherDto._id) {
      publisherDocument = await this.publisherRepository.findById(publisherDto._id);
      if (!publisherDocument) {
        throw new HttpException('publisher not found', HttpStatus.NOT_FOUND);
      } else {
        publisherDocument = this.publisherMapper.asignDtoValuesToDocument(publisherDocument, publisherDto);
        publisherDocument = await this.publisherRepository.update(publisherDocument);
      }
    } else {
      publisherDocument = await this.publisherRepository.create(publisherDto);
    }

    return publisherDocument;
  }
}
