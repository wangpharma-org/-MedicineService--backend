import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,     
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('Prescription Service API')
    .setDescription('API documentation for the Prescription Service')
    .setVersion('1.0')
    .addTag('prescription')
    .build();
    
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-service',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'product-service-consumer',
      },
    }
  })

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3002);
}
void bootstrap();
