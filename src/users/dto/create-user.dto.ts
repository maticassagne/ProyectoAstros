import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 2 caracteres.' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 2 caracteres.' })
  apellido: string;
}
