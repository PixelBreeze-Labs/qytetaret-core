// src/modules/report/dtos/create-report.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNotEmpty()
  location!: {
    type: string;
    coordinates: [number, number];
  };

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  media?: string[];
}