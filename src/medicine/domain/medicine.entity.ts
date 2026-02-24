import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'medicines' })
export class Medicine extends BaseEntity {
  @Column({ name: 'medicine_code', type: 'varchar', unique: true })
  medicineCode: string;

  @Column({ name: 'medicine_name_en', type: 'varchar', nullable: true })
  medicineName_en: string | null;

  @Column({ name: 'medicine_name_th', type: 'varchar', nullable: true })
  medicineName_th: string | null;

  @Column({ name: 'medicine_method_en', type: 'text', nullable: true })
  medicineMethod_en: string | null;

  @Column({ name: 'medicine_method_th', type: 'text', nullable: true })
  medicineMethod_th: string | null;

  @Column({ name: 'medicine_condition_th', type: 'text', nullable: true })
  medicineCondition_th: string | null;

  @Column({ name: 'medicine_condition_en', type: 'text', nullable: true })
  medicineCondition_en: string | null;

  @Column({ name: 'medicine_note', type: 'text', nullable: true })
  medicineNote: string | null;

  @Column({ name: 'room_id', type: 'uuid', nullable: true})
  roomId: string;
}
