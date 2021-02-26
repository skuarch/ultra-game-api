import { PublisherDto } from '../publisher/pubilsher-dto';

export interface GameDto {
  _id?: string;
  title: string;
  price: string;
  originalPrice?: string;
  publisher: PublisherDto;
  tags: string[];
  releaseDate: Date;
}
