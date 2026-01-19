import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './backend/routes/admin.js';
import apiRoutes from './backend/routes/api.js';
import authRoutes from './backend/routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'primaria-pociumbauti-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true, // Changed to true to ensure session is created
  name: 'sessionId', // Explicit session name
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax', // Allow cross-site requests in development
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Trust proxy for correct IP addresses
app.set('trust proxy', 1);

// Routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  // Server started
});

