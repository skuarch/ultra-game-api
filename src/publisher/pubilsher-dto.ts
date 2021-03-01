import { ApiProperty } from '@nestjs/swagger';

export class PublisherDto {
  _id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  siret: number;

  @ApiProperty()
  phone: string;
}
