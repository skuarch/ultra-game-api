import { PublisherDto } from './pubilsher-dto';
import { PublisherDocument } from './publisher.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublisherMapperService {
  asignDtoValuesToDocument(publisherDocument: PublisherDocument, publisherDto: PublisherDto): PublisherDocument {
    return Object.assign(publisherDocument, publisherDto);
  }

  mapPublisherDocumentToDto(publisherDocument: PublisherDocument): PublisherDto {
    const { _id, name, phone, siret } = publisherDocument;
    const publisherDto = { _id, name, phone, siret };
    return publisherDto;
  }
}
