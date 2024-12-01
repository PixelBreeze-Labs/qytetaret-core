// src/modules/report/dtos/update-report.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number, number];
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  media?: string[];
}