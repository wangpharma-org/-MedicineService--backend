import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './domain/medicine.entity';
import { MedicineController } from './presentation/medicine.controller';
import { MedicineService } from './application/medicine.service';
import { MedicineRepository } from './infrastructure/medicine.repository';
import { MEDICINE_REPOSITORY } from './domain/ports/medicine.repository.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboxEvent } from './domain/outbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine, OutboxEvent]), 
  ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'medicine-service',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [MedicineController],
  providers: [
    MedicineService,
    { provide: MEDICINE_REPOSITORY, useClass: MedicineRepository },
  ],
  exports: [MedicineService],
})
export class MedicineModule {}
