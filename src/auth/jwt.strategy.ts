import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      // Le decimos que extraiga el token del encabezado 'Authorization' como un Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No ignoramos la expiración del token
      ignoreExpiration: true,
      // Usamos el mismo secreto que para firmar el token
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Este método se ejecuta una vez que el token ha sido validado
  async validate(payload: { id: string; email: string }) {
    // La validación fue exitosa, el 'payload' es el token decodificado.
    // Ahora buscamos al usuario en la base de datos para asegurarnos de que todavía existe.
    const user = await this.usersService.findOne(payload.id); // Necesitaremos crear este método
    if (!user) {
      throw new UnauthorizedException('Token inválido, el usuario no existe.');
    }

    // Lo que retornemos aquí se adjuntará al objeto `request` como `req.user`
    return user;
  }
}
