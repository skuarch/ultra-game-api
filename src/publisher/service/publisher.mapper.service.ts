import { PublisherDto } from '../dto/publisher.dto.interface';
import { PublisherDocument } from '../schema/publisher.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublisherMapperService {
  asignDtoValuesToDocument(publisherDocument: PublisherDocument, publisherDto: PublisherDto): PublisherDocument {
    return Object.assign(publisherDocument, publisherDto);
  }

  mapPublisherDocumentToDto(publisherDocument: PublisherDocument): PublisherDto {
    const publisherDto: PublisherDto = {
      _id: publisherDocument._id,
      name: publisherDocument.name,
      phone: publisherDocument.phone,
      siret: publisherDocument.siret,
    };
    return publisherDto;
  }
}
