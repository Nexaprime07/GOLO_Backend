import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FurnitureDocument = Furniture & Document;

@Schema({ _id: false, timestamps: false })
export class Furniture {
  @Prop({ required: true, enum: [
    'Sofa', 'Bed', 'Dining Table', 'Chair', 'Table', 'Wardrobe',
    'Dressing Table', 'Bookshelf', 'Cabinet', 'Mattress', 'Other'
  ]})
  furnitureType: string;

  @Prop({ required: true })
  material: string;

  @Prop()
  color: string;

  @Prop()
  dimensions: string;

  @Prop()
  weight: number;

  @Prop()
  condition: string;

  @Prop()
  assemblyRequired: boolean;

  @Prop()
  style: string;

  @Prop()
  brand: string;

  @Prop()
  yearOfPurchase: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  originalPrice: number;

  @Prop()
  negotiable: boolean;

  @Prop()
  deliveryAvailable: boolean;

  @Prop()
  deliveryCharges: number;
}

export const FurnitureSchema = SchemaFactory.createForClass(Furniture);