import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ _id: false, timestamps: false })
export class Vehicle {
  @Prop({ required: true, enum: ['Rent', 'Sell'] })
  type: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] })
  fuelType: string;

  @Prop({ required: true, enum: ['Manual', 'Automatic'] })
  transmission: string;

  @Prop({ required: true })
  kilometersDriven: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  color: string;

  @Prop()
  insurance: string;

  @Prop()
  registrationNumber: string;

  @Prop()
  ownerNumber: number;

  @Prop({ type: [String] })
  features: string[];

  @Prop()
  condition: string;

  @Prop()
  emiAvailable: boolean;

  @Prop()
  exchangeAvailable: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);