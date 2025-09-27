import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, ip } = req;
    const timestamp = new Date().toLocaleString('es-AR');

    console.log(`[${timestamp}] Petición entrante: ${method} - IP: ${ip}`);

    // next() es crucial para pasar la petición al siguiente manejador.
    // Si no lo llamas, la petición se quedará "colgada".
    next();
  }
}
