import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmploymentDocument = Employment & Document;

@Schema({ _id: false, timestamps: false })
export class Employment {
  @Prop({ required: true, enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'] })
  jobType: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  companyName: string;

  @Prop()
  location: string;

  @Prop()
  experienceRequired: string;

  @Prop()
  salary: string;

  @Prop()
  qualifications: string;

  @Prop()
  skills: string[];

  @Prop()
  description: string;

  @Prop()
  vacancies: number;

  @Prop()
  lastDateToApply: Date;

  @Prop()
  contactPerson: string;

  @Prop()
  contactNumber: string;

  @Prop()
  email: string;

  @Prop()
  website: string;
}

export const EmploymentSchema = SchemaFactory.createForClass(Employment);