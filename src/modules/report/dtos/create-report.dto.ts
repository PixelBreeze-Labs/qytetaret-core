import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsBoolean, IsNumber, ValidateNested } from 'class-validator';

export class LocationDto {
    @ApiProperty()
    @IsNumber()
    lat!: number;

    @ApiProperty()
    @IsNumber()
    lng!: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    accuracy?: number;
}

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
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  media?: any;

  @ApiProperty()
  @IsOptional()
  audio?: string;
}