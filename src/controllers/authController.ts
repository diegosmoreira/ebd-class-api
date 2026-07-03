import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  static async changePassword(req: Request, res: Response) {
    // Assumes userId is injected by auth middleware
    const userId = (req as any).user.userId;
    const { oldPassword, newPassword } = req.body;
    try {
      await AuthService.changePassword(userId, oldPassword, newPassword);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async adminResetPassword(req: Request, res: Response) {
    const adminId = (req as any).user.userId;
    const { user_id } = req.params as { user_id: string };
    try {
      await AuthService.adminResetPassword(adminId, user_id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
