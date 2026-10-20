import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEventDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() location: string;
  @IsString() date: string;
  @IsString() category: string;
  @IsOptional() @IsString() image?: number;
  @IsNumber() @Min(0) price: number;
}
