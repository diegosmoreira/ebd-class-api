import { Request, Response, NextFunction } from 'express';

export const requirePasswordChangeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  // If the user must change password, deny access unless it is the change-password route
  if (user && user.mustChangePassword && req.path !== '/auth/change-password') {
    return res.status(403).json({ error: 'Você precisa alterar sua senha padrão antes de continuar' });
  }
  next();
};
