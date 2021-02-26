import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publisher & Document;

@Schema({ timestamps: true })
export class Publisher extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  siret: number;

  @Prop()
  phone: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
