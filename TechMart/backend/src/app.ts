import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes';
import transactionRoutes from './routes/transaction.routes';
import inventoryRoutes from './routes/inventory.routes';
import analyticsRoutes from './routes/analytics.routes';
import alertRoutes from './routes/alert.routes';
import http from 'http';
import { initSocket } from './sockets'; // Your Socket.IO setup

const app = express();
const server = http.createServer(app);

initSocket(server); // 🔌 Initialize socket with HTTP server

app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);

export default app;