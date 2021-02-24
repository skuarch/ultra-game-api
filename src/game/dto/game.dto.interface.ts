import { ApiProperty } from '@nestjs/swagger';
import { PublisherDto } from '../../publisher/dto/publisher.dto.interface';

export class GameDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: string;

  originalPrice?: string;

  @ApiProperty()
  publisher: PublisherDto;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  releaseDate: Date;
}
