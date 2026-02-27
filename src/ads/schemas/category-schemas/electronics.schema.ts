import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ElectronicsDocument = Electronics & Document;

@Schema({ _id: false, timestamps: false })
export class Electronics {
  @Prop({ required: true, enum: [
    'TV', 'Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner',
    'Laptop', 'Desktop', 'Tablet', 'Camera', 'Speaker', 'Headphones',
    'Gaming Console', 'Printer', 'Router', 'Smart Watch', 'Other'
  ]})
  productType: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  yearOfPurchase: number;

  @Prop()
  condition: string;

  @Prop({ type: Map, of: String })
  specifications: Map<string, string>;

  @Prop()
  warranty: string;

  @Prop()
  warrantyExpiry: Date;

  @Prop({ type: [String] })
  accessories: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice: number;

  @Prop()
  negotiable: boolean;

  @Prop()
  billAvailable: boolean;

  @Prop()
  boxAvailable: boolean;

  @Prop()
  powerSupply: string;
}

export const ElectronicsSchema = SchemaFactory.createForClass(Electronics);