import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatrimonialDocument = Matrimonial & Document;

@Schema({ _id: false, timestamps: false })
export class Matrimonial {
  @Prop({ required: true })
  profileFor: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  maritalStatus: string;

  @Prop()
  religion: string;

  @Prop()
  caste: string;

  @Prop()
  motherTongue: string;

  @Prop()
  education: string;

  @Prop()
  occupation: string;

  @Prop()
  annualIncome: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  about: string;

  @Prop({ type: [String] })
  hobbies: string[];

  @Prop()
  diet: string;

  @Prop()
  drink: string;

  @Prop()
  smoke: string;

  @Prop()
  contactNumber: string;

  @Prop()
  email: string;
}

export const MatrimonialSchema = SchemaFactory.createForClass(Matrimonial);