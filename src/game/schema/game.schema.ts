import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Publisher } from '../../publisher/schema/publisher.schema';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 0, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  originalPrice: number;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
  })
  publisher: Publisher;

  @Prop({ default: false })
  discountApplied: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
