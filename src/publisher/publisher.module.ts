import { Module } from '@nestjs/common';
import { Publisher, PublisherSchema } from './schema/publisher.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PublisherRepositoryService } from './service/publisher.repository.service';
import { PublisherValidatorService } from './service/publisher.validator.service';
import { PublisherMapperService } from './service/publisher.mapper.service';
import { PublisherService } from './service/publisher.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }])],
  providers: [PublisherRepositoryService, PublisherValidatorService, PublisherMapperService, PublisherService],
  exports: [PublisherRepositoryService, PublisherValidatorService, PublisherMapperService, PublisherService],
})
export class PublisherModule {}
