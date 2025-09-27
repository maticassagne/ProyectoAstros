import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // No admite propiedades que no esten en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envian propiedades no admitidas
    }),
  );

  // Obtener y loguear la configuración de la BD desde ConfigService
  const config = app.get(ConfigService);
  const db = config.get<{ host?: string; port?: number }>('database');
  console.log(
    `Database host: ${db?.host ?? 'unknown'}  port: ${db?.port ?? 'unknown'}`,
  );

  const port = parseInt(process.env.APP_PORT || '3000', 10);
  await app.listen(port);
  const url = await app.getUrl();
  const urlObject = new URL(url);
  const actualPort = urlObject.port;

  console.log(`Servidor corriendo en puerto: ${actualPort}`);
}

bootstrap();
