import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const rolesMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado: perfil insuficiente' });
    }
    next();
  };
};
