import { Controller, Inject, Logger } from "@nestjs/common";
import { StockSnapshotService } from "../application/stocksnapshot.service";
import { ClientKafka, EventPattern } from "@nestjs/microservices";
import { handleKafkaRetry } from "src/common/utils/kafka-retry.util";

@Controller()
export class StockSnapshotEventConsumer {
    constructor(
        private readonly stockSnapshotService: StockSnapshotService,
    ) {}
    
    @EventPattern('room.created.v1')
    async handleRoomCreatedEvent(payload: any) {
        const { roomId, roomName, description, snapshotDate } = payload;
        
        // try {
        await this.stockSnapshotService.create({
            roomId,
            roomName,
            description,
            snapshotDate,
        });
        // } catch (error) {
        //     handleKafkaRetry({
        //         kafkaClient: this.kafkaClient,
        //         payload,
        //         error,
        //         retryTopic: 'room.created.retry.v1',
        //         dlqTopic: 'room.created.dlq.v1'
        //     });
        // }
    }

    @EventPattern('room.updated.v1')
    async handleRoomUpdatedEvent(payload: any) {
        const { roomId, roomName, roomDescription } = payload;
        
        Logger.debug(`Received room.updated.v1 event for roomId: ${roomId}, roomName: ${roomName}, roomDescription: ${roomDescription}`, StockSnapshotEventConsumer.name);
        await this.stockSnapshotService.update(roomId, {
            roomName,
            description: roomDescription,
        });
    }

    @EventPattern('room.deleted.v1')
    async handleRoomDeletedEvent(payload: any) {
        const { roomId } = payload;

        await this.stockSnapshotService.remove(roomId);
    }
}