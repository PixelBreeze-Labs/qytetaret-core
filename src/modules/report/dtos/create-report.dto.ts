import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty()
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  } = { lat: 0, lng: 0 };

  @ApiProperty()
  @IsOptional()
  @IsArray()
  media?: string[];

  @ApiProperty()
  @IsOptional()
  audio?: string;
}