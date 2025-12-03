import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);


// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n Server running on http://localhost:${PORT}`);
      console.log(` API Health: http://localhost:${PORT}/api/health`);
      console.log(`  Database: PostgreSQL`);
      console.log(`\n Available Endpoints:`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/tasks`);
      console.log(`   GET    /api/tasks/:id`);
      console.log(`   POST   /api/tasks`);
      console.log(`   PUT    /api/tasks/:id`);
      console.log(`   PATCH  /api/tasks/:id/status`);
      console.log(`   DELETE /api/tasks/:id\n`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();