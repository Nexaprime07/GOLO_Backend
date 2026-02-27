import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelDocument = Travel & Document;

@Schema({ _id: false, timestamps: false })
export class Travel {
  @Prop({ required: true, enum: ['Package', 'Guide', 'Transport', 'Accommodation', 'Trip'] })
  type: string;

  @Prop({ required: true })
  destination: string;

  @Prop()
  duration: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  price: number;

  @Prop()
  inclusions: string;

  @Prop()
  exclusions: string;

  @Prop()
  itinerary: string;

  @Prop()
  groupSize: number;

  @Prop()
  accommodation: string;

  @Prop()
  mealsIncluded: boolean;

  @Prop()
  transportation: string;

  @Prop()
  guideIncluded: boolean;

  @Prop()
  activities: string[];

  @Prop()
  contactNumber: string;

  @Prop()
  email: string;

  @Prop()
  website: string;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);