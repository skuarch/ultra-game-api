import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Publisher } from '../publisher/publisher.schema';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  originalPrice: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ default: false })
  discountApplied: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
  })
  publisher: Publisher;
}

export const GameSchema = SchemaFactory.createForClass(Game);
