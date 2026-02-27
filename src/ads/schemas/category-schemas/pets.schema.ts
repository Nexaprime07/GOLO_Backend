import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetsDocument = Pets & Document;

@Schema({ _id: false, timestamps: false })
export class Pets {
  @Prop({ required: true, enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'] })
  petType: string;

  @Prop()
  breed: string;

  @Prop()
  age: number;

  @Prop()
  ageUnit: string;

  @Prop()
  gender: string;

  @Prop()
  color: string;

  @Prop()
  size: string;

  @Prop()
  vaccinated: boolean;

  @Prop()
  dewormed: boolean;

  @Prop()
  microchipped: boolean;

  @Prop()
  neutered: boolean;

  @Prop()
  healthCertificate: boolean;

  @Prop()
  trained: boolean;

  @Prop()
  price: number;

  @Prop()
  purpose: string;

  @Prop()
  pedigree: boolean;

  @Prop({ type: [String] })
  images: string[];
}

export const PetsSchema = SchemaFactory.createForClass(Pets);