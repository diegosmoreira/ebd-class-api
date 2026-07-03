import { Request, Response } from 'express';
import { PdfReportService } from '../services/pdfReportService';
import { ExcelReportService } from '../services/excelReportService';

export class RelatorioController {
  static async exportarEscalaPDF(req: Request, res: Response) {
    try {
      const { classeId, trimestreId } = req.query as { classeId: string; trimestreId: string };
      if (!classeId || !trimestreId) {
        return res.status(400).json({ error: 'classeId e trimestreId são obrigatórios' });
      }
      const buffer = await PdfReportService.exportEscala(classeId, trimestreId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=escala.pdf');
      return res.send(buffer);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async exportarEscalaExcel(req: Request, res: Response) {
    try {
      const { classeId, trimestreId } = req.query as { classeId: string; trimestreId: string };
      if (!classeId || !trimestreId) {
        return res.status(400).json({ error: 'classeId e trimestreId são obrigatórios' });
      }
      const buffer = await ExcelReportService.exportEscala(classeId, trimestreId);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=escala.xlsx');
      return res.send(buffer);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
