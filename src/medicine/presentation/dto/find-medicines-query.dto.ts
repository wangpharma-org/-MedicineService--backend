import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMedicinesQueryDto {
  @ApiPropertyOptional({ example: 1, type: 'number', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ example: 10, type: 'number', minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ example: 'MED-001', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCode?: string;

  @ApiPropertyOptional({ example: 'Amoxicillin', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_en?: string;
}
