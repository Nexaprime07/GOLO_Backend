import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LostFoundDocument = LostFound & Document;

@Schema({ _id: false, timestamps: false })
export class LostFound {
  @Prop({ required: true, enum: ['Lost', 'Found'] })
  type: string;

  @Prop({ required: true })
  itemName: string;

  @Prop()
  category: string;

  @Prop()
  brand: string;

  @Prop()
  color: string;

  @Prop()
  distinctiveFeatures: string;

  @Prop()
  lostFoundLocation: string;

  @Prop()
  lostFoundDate: Date;

  @Prop()
  reward: string;

  @Prop()
  contactName: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop()
  email: string;

  @Prop({ type: [String] })
  images: string[];
}

export const LostFoundSchema = SchemaFactory.createForClass(LostFound);