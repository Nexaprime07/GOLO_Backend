import { IsEnum, IsString, IsNumber, IsOptional, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class VehicleDto {
  @IsEnum(['Rent', 'Sell'])
  type: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  year: number;

  @IsEnum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'])
  fuelType: string;

  @IsEnum(['Manual', 'Automatic'])
  transmission: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kilometersDriven: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  insurance?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  ownerNumber?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsBoolean()
  emiAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  exchangeAvailable?: boolean;
}