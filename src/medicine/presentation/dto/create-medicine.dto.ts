import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ example: 'MED-001', type: 'string' })
  @IsString()
  @IsNotEmpty()
  medicineCode: string;

  @ApiPropertyOptional({ example: 'Amoxicillin', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_en?: string;

  @ApiPropertyOptional({ example: 'อะม็อกซีซิลลิน', type: 'string' })
  @IsOptional()
  @IsString()
  medicineName_th?: string;

  @ApiPropertyOptional({ example: 'Take 1 tablet orally 3 times a day', type: 'string' })
  @IsOptional()
  @IsString()
  medicineMethod_en?: string;

  @ApiPropertyOptional({ example: 'รับประทาน 1 เม็ด วันละ 3 ครั้ง', type: 'string' })
  @IsOptional()
  @IsString()
  medicineMethod_th?: string;

  @ApiPropertyOptional({ example: 'เก็บในที่แห้ง อุณหภูมิต่ำกว่า 30°C', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCondition_th?: string;

  @ApiPropertyOptional({ example: 'Store in a dry place below 30°C', type: 'string' })
  @IsOptional()
  @IsString()
  medicineCondition_en?: string;

  @ApiPropertyOptional({ example: 'Avoid use with alcohol', type: 'string' })
  @IsOptional()
  @IsString()
  medicineNote?: string;

  @ApiPropertyOptional({ example: 'uuid-of-room', type: 'string' })
  @IsString()
  roomId: string;
}
