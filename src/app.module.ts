import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoriesModule } from './products/categories/categories.module';
import { SuppliersModule } from './stock/suppliers/suppliers.module';
import { ClientsModule } from './sales/clients/clients.module';
import { ProductsModule } from './products/products/products.module';
import { LotesModule } from './stock/lotes/lotes.module';
import { MovementsModule } from './stock/movements/movements.module';
import { ComprobantesModule } from './sales/comprobantes/comprobantes.module';

@Module({
  imports: [
    // Cargar la configuración registrada con registerAs('database')
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const db = configService.get<TypeOrmModuleOptions>('database');
        if (!db) {
          throw new Error(
            'Database configuration not found (registerAs("database") not loaded or env vars missing)',
          );
        }
        return db;
      },
      inject: [ConfigService],
    }),
    CategoriesModule,
    SuppliersModule,
    ClientsModule,
    ProductsModule,
    LotesModule,
    MovementsModule,
    ComprobantesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
