import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { Comprobante, ComprobanteType } from './entities/comprobante.entity';
import { ComprobanteItem } from './entities/comprobante-item.entity';
import { Product } from 'src/products/products/entities/product.entity';
import { Client } from 'src/sales/clients/entities/client.entity';
import { Lote } from 'src/stock/lotes/entities/lote.entity';
import {
  StockMovement,
  MovementType,
} from 'src/stock/movements/entities/movement.entity';

@Injectable()
export class ComprobantesService {
  constructor(
    private readonly dataSource: DataSource, // Usaremos DataSource para manejar la transacción
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createComprobanteDto: CreateComprobanteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { clientId, items } = createComprobanteDto;

    try {
      // ## PASO 1: VALIDAR Y OBTENER DATOS ##
      const client = await queryRunner.manager.findOneBy(Client, {
        id: clientId,
      });
      if (!client)
        throw new NotFoundException(
          `Cliente con ID '${clientId}' no encontrado.`,
        );

      let totalComprobante = 0;
      const comprobanteItems: ComprobanteItem[] = [];
      const lotesToUpdate: Lote[] = [];
      const movementsToCreate: StockMovement[] = [];

      // ## PASO 2: VERIFICAR STOCK Y PREPARAR ITEMS (FIFO) ##
      for (const itemDto of items) {
        const product = await queryRunner.manager.findOneBy(Product, {
          id: itemDto.productId,
        });
        if (!product)
          throw new NotFoundException(
            `Producto con ID '${itemDto.productId}' no encontrado.`,
          );

        // Buscamos todos los lotes de este producto con stock, ordenados por fecha de vencimiento (FIFO)
        const lotes = await queryRunner.manager.find(Lote, {
          where: { product: { id: itemDto.productId } },
          order: { fechaVencimiento: 'ASC' },
        });

        const stockTotal = lotes.reduce((sum, lote) => sum + lote.cantidad, 0);
        if (stockTotal < itemDto.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para el producto '${product.nombre}'. Stock disponible: ${stockTotal}.`,
          );
        }

        // Lógica FIFO para descontar stock
        let cantidadRestante = itemDto.cantidad;
        for (const lote of lotes) {
          if (cantidadRestante <= 0) break;
          const cantidadADescontar = Math.min(lote.cantidad, cantidadRestante);
          lote.cantidad -= cantidadADescontar;
          cantidadRestante -= cantidadADescontar;
          lotesToUpdate.push(lote);
        }

        // Crear el item del comprobante
        const newItem = new ComprobanteItem();
        newItem.product = product;
        newItem.cantidad = itemDto.cantidad;
        newItem.precioUnitario = product.precioVenta1; // Usamos la lista de precios 1 por ahora
        comprobanteItems.push(newItem);
        totalComprobante += newItem.precioUnitario * newItem.cantidad;

        // Crear el movimiento de stock
        const newMovement = new StockMovement();
        newMovement.product = product;
        newMovement.cantidad = -itemDto.cantidad; // Negativo porque es una salida
        newMovement.tipo = MovementType.VENTA;
        movementsToCreate.push(newMovement);
      }

      // ## PASO 3: CREAR Y GUARDAR ENTIDADES ##
      const newComprobante = new Comprobante();
      newComprobante.client = client;
      newComprobante.items = comprobanteItems;
      newComprobante.total = totalComprobante;
      newComprobante.tipo = createComprobanteDto.tipo;

      // Guardamos todo dentro de la transacción
      await queryRunner.manager.save(lotesToUpdate);
      await queryRunner.manager.save(movementsToCreate);
      const savedComprobante = await queryRunner.manager.save(newComprobante);

      await queryRunner.commitTransaction();
      return savedComprobante;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // Usamos BadRequestException para errores de negocio (ej: stock insuficiente)
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      // InternalServerError para errores inesperados de la base de datos
      throw new Error('Error al crear el comprobante: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
