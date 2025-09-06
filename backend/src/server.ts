import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import roleRoutes from './routes/roleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourfrontend.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/roles', roleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Team Role Assignment API'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'NOT_FOUND',
    message: 'Endpoint not found' 
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'INTERNAL_ERROR',
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   POST /api/roles/assign - Assign roles to team members`);
  console.log(`   GET  /api/roles/health - Role service health check`);
  console.log(`   GET  /api/health - General health check`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found. Please set it in your .env file');
  }
});

export default app;