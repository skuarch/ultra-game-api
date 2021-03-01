import { PublisherDto } from '../publisher/pubilsher-dto';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
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
