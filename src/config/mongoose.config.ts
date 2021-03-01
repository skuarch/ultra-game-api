import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  private logger = new Logger('MongooseConfig');

  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.configService.get<string>('URI_CONNECTION');
    this.logger.debug(`Conneting to ${uri}`);
    return {
      uri: uri,
    };
  }
}
