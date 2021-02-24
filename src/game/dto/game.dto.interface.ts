import { PublisherDto } from '../../publisher/dto/publisher.dto.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: number;

  originalPrice?: number;

  @ApiProperty()
  publisher: PublisherDto;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  releaseDate: Date;
}
