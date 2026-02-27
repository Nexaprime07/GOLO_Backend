import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ _id: false, timestamps: false })
export class Service {
  @Prop({ required: true, enum: [
    'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner',
    'AC Repair', 'Appliance Repair', 'Pest Control', 'Packers Movers',
    'Beauty Parlor', 'Salon at Home', 'Spa', 'Photographer',
    'Event Planner', 'Tutor', 'Driver', 'Security Guard',
    'Web Developer', 'Designer', 'Catering', 'Other'
  ]})
  serviceType: string;

  @Prop({ required: true })
  experience: number;

  @Prop()
  qualification: string;

  @Prop()
  specialization: string;

  @Prop()
  hourlyRate: number;

  @Prop()
  dailyRate: number;

  @Prop()
  projectRate: number;

  @Prop({ type: [String] })
  availableDays: string[];

  @Prop()
  availableTimeFrom: string;

  @Prop()
  availableTimeTo: string;

  @Prop()
  emergencyService: boolean;

  @Prop()
  emergencyCharge: number;

  @Prop({ type: [String] })
  serviceArea: string[];

  @Prop()
  serviceRadius: number;

  @Prop()
  licenseNumber: string;

  @Prop()
  insured: boolean;

  @Prop()
  professionalTools: boolean;

  @Prop()
  teamSize: number;

  @Prop()
  languages: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);