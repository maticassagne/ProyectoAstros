import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/common/entities/role.entity/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role) // <-- Inyectar repositorio de Role
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { roleId, ...userData } = createUserDto;

    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new BadRequestException(`El rol con ID '${roleId}' no existe.`);
    }

    // ... la lógica para verificar si el email existe sigue igual ...

    const user = this.userRepository.create({ ...userData, role });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return this.userRepository.find();
  }
}
