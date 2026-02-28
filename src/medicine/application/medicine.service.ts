import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  MEDICINE_REPOSITORY,
  type IMedicineRepository,
} from '../domain/ports/medicine.repository.interface';
import { Medicine } from '../domain/medicine.entity';
import { CreateMedicineDto } from '../presentation/dto/create-medicine.dto';
import { UpdateMedicineDto } from '../presentation/dto/update-medicine.dto';
import { FindMedicinesQueryDto } from '../presentation/dto/find-medicines-query.dto';
import {
  buildPaginationMeta,
  buildPaginationOptions,
  PaginationMeta,
} from '../../common/utils/pagination.util';
import { DataSource, FindOptionsWhere, ILike } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class MedicineService {
  private readonly logger = new Logger(MedicineService.name);

  constructor(
    @Inject(MEDICINE_REPOSITORY)
    private readonly medicineRepository: IMedicineRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateMedicineDto): Promise<Medicine> {
    return this.dataSource.transaction(async (manager) => {
      const medicineRepo = manager.getRepository(Medicine);

      const medicine = medicineRepo.create({
        medicineCode: dto.medicineCode,
        medicineName_en: dto.medicineName_en ?? null,
        medicineName_th: dto.medicineName_th ?? null,
        medicineMethod_en: dto.medicineMethod_en ?? null,
        medicineMethod_th: dto.medicineMethod_th ?? null,
        medicineCondition_th: dto.medicineCondition_th ?? null,
        medicineCondition_en: dto.medicineCondition_en ?? null,
        medicineNote: dto.medicineNote ?? null,
        roomId: dto.roomId,
      });

      const savedMedicine = await medicineRepo.save(medicine);

      await this.kafkaClient.emit('medicine.created.v1', {
        medicineId: savedMedicine.id,
        roomId: savedMedicine.roomId,
        info: {
          medicineCode: savedMedicine.medicineCode,
          medicineName_en: savedMedicine.medicineName_en,
          medicineName_th: savedMedicine.medicineName_th,
        }
      });

      return savedMedicine;
    });
  }

  async findAll(
    query: FindMedicinesQueryDto,
  ): Promise<{ data: Medicine[]; meta: PaginationMeta }> {
    const { page, limit, medicineCode, medicineName_en } = query;
    const { skip, take } = buildPaginationOptions(page, limit);

    const where: FindOptionsWhere<Medicine> = {};
    if (medicineCode) where.medicineCode = medicineCode;
    if (medicineName_en) where.medicineName_en = ILike(`%${medicineName_en}%`);
    
    const [data, total] = await this.medicineRepository.findAndCount({
      where,
      skip,
      take,
      order: { medicineCode: 'ASC' },
    });
    
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string): Promise<Medicine> {
    const medicine = await this.medicineRepository.findById(id);

    if (!medicine) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'medicineNotFound' },
      });
    }

    return medicine;
  }

  async update(id: string, dto: UpdateMedicineDto): Promise<Medicine> {
    const medicine = await this.findById(id);

    if (dto.medicineName_en !== undefined) medicine.medicineName_en = dto.medicineName_en;
    if (dto.medicineName_th !== undefined) medicine.medicineName_th = dto.medicineName_th;
    if (dto.medicineMethod_en !== undefined) medicine.medicineMethod_en = dto.medicineMethod_en;
    if (dto.medicineMethod_th !== undefined) medicine.medicineMethod_th = dto.medicineMethod_th;
    if (dto.medicineCondition_th !== undefined) medicine.medicineCondition_th = dto.medicineCondition_th;
    if (dto.medicineCondition_en !== undefined) medicine.medicineCondition_en = dto.medicineCondition_en;
    if (dto.medicineNote !== undefined) medicine.medicineNote = dto.medicineNote;
    if (dto.roomId !== undefined) medicine.roomId = dto.roomId;

    const savedMedicine = await this.medicineRepository.save(medicine);

    await this.kafkaClient.emit('medicine.updated.v1', {
        medicineId: savedMedicine.id,
        info: {
          medicineCode: savedMedicine.medicineCode,
          medicineName_en: savedMedicine.medicineName_en,
          medicineName_th: savedMedicine.medicineName_th,
        }
    });

    return savedMedicine;
  }

  async remove(id: string): Promise<void> {
    const medicine = await this.findById(id);
    await this.medicineRepository.softDelete(id);

    await this.kafkaClient.emit('medicine.deleted.v1', {
      medicineCode: medicine.medicineCode,
    });
  }
}
