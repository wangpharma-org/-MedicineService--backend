import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Medicine } from '../domain/medicine.entity';
import { IMedicineRepository } from '../domain/ports/medicine.repository.interface';

@Injectable()
export class MedicineRepository implements IMedicineRepository {
  constructor(
    @InjectRepository(Medicine)
    private readonly repository: Repository<Medicine>,
  ) {}

  findById(id: string): Promise<Medicine | null> {
    return this.repository.findOneBy({ id });
  }

  findByCode(medicineCode: string): Promise<Medicine | null> {
    return this.repository.findOneBy({ medicineCode });
  }

  findAndCount(
    options: FindManyOptions<Medicine>,
  ): Promise<[Medicine[], number]> {
    return this.repository.findAndCount(options);
  }

  create(data: Partial<Medicine>): Medicine {
    return this.repository.create(data);
  }

  save(medicine: Medicine): Promise<Medicine> {
    return this.repository.save(medicine);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
