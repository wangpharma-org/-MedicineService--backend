import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MedicineService } from '../application/medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { FindMedicinesQueryDto } from './dto/find-medicines-query.dto';
import { Medicine } from '../domain/medicine.entity';
import { PaginationMeta } from '../../common/utils/pagination.util';

@ApiTags('medicines')
@Controller('medicines')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @ApiOperation({ summary: 'Create a new medicine' })
  @Post()
  create(@Body() dto: CreateMedicineDto): Promise<Medicine> {
    return this.medicineService.create(dto);
  }

  @ApiOperation({ summary: 'List medicines with pagination and filters' })
  @Get()
  findAll(
    @Query() query: FindMedicinesQueryDto,
  ): Promise<{ data: Medicine[]; meta: PaginationMeta }> {
    return this.medicineService.findAll(query);
  }

  @ApiOperation({ summary: 'Get medicine by ID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Medicine> {
    return this.medicineService.findById(id);
  }

  @ApiOperation({ summary: 'Update medicine' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicineDto,
  ): Promise<Medicine> {
    return this.medicineService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete (soft-delete) medicine' })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.medicineService.remove(id);
  }
}
