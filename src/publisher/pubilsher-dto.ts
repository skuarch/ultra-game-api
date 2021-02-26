import { ApiProperty } from '@nestjs/swagger';

export class PublisherDto {
  // @ApiProperty()
  _id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  siret: number;

  @ApiProperty()
  phone: string;
}
