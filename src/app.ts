import express, { Request, Response, NextFunction } from 'express';

import { errorHandler } from './middlewares/errorHandler';
import classeRoutes from './routes/classeRoutes';
import professorRoutes from './routes/professorRoutes';
import licaoRoutes from './routes/licaoRoutes';
import trimestreRoutes from './routes/trimestreRoutes';
import authRoutes from './routes/authRoutes';
import aulaRoutes from './routes/aulaRoutes';
import trocaRoutes from './routes/trocaRoutes';
import relatorioRoutes from './routes/relatorioRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import { authMiddleware } from './middlewares/auth';
import { requirePasswordChangeMiddleware } from './middlewares/restricted';

const app = express();

app.use(express.json());

// Public Routes
app.use('/auth', authRoutes);

// Protected Routes
app.use(authMiddleware);
app.use(requirePasswordChangeMiddleware);

app.use('/classes', classeRoutes);
app.use('/professores', professorRoutes);
app.use('/licoes', licaoRoutes);
app.use('/trimestres', trimestreRoutes);
app.use('/aulas', aulaRoutes);
app.use('/trocas', trocaRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/usuarios', usuarioRoutes);

// Error Handler MUST be the last middleware
app.use(errorHandler);

export default app;
