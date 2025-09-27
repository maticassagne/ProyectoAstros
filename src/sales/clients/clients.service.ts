import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    queryBuilder.where('client.nombre = :nombre', {
      nombre: createClientDto.nombre,
    });
    if (createClientDto.cuit) {
      queryBuilder.orWhere('client.cuit = :cuit', {
        cuit: createClientDto.cuit,
      });
    }
    const existingClient = await queryBuilder.getOne();

    if (existingClient) {
      throw new ConflictException(
        'Ya existe un cliente con ese nombre o CUIT.',
      );
    }
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Cliente con id: '${id}' no encontrado.`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const clientToUpdate = await this.findOne(id);

    // Si no se envió body o está vacío, respondemos con 400 (o podrías devolver el recurso sin cambios)
    if (!updateClientDto || Object.keys(updateClientDto).length === 0) {
      return clientToUpdate;
    }

    if (updateClientDto.cuit) {
      const existing = await this.clientRepository.findOne({
        where: { cuit: updateClientDto.cuit, id: Not(id) },
      });
      if (existing)
        throw new ConflictException(
          `El CUIT: '${updateClientDto.cuit}' ya está en uso.`,
        );
    }
    this.clientRepository.merge(clientToUpdate, updateClientDto);
    return this.clientRepository.save(clientToUpdate);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
    return { message: `Cliente: '${client.nombre}' eliminado correctamente.` };
  }
}
