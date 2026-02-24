import { FindManyOptions } from 'typeorm';
import { Medicine } from '../medicine.entity';

export interface IMedicineRepository {
  findById(id: string): Promise<Medicine | null>;
  findByCode(medicineCode: string): Promise<Medicine | null>;
  findAndCount(
    options: FindManyOptions<Medicine>,
  ): Promise<[Medicine[], number]>;
  create(data: Partial<Medicine>): Medicine;
  save(medicine: Medicine): Promise<Medicine>;
  softDelete(id: string): Promise<void>;
}

export const MEDICINE_REPOSITORY = Symbol('IMedicineRepository');
