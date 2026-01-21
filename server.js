import express from 'express';
import cors from 'cors';
import session from 'express-session';
import FileStore from 'session-file-store';
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

// ✅ Создать файловое хранилище для сессий
const SessionStore = FileStore(session);

app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session с файловым хранилищем
app.use(session({
  store: new SessionStore({
    path: path.join(__dirname, 'sessions'), // Папка для хранения сессий
    ttl: 30 * 24 * 60 * 60, // 30 days
    retries: 0,
    reapInterval: 3600 // Очистка старых сессий каждый час
  }),
  secret: process.env.SESSION_SECRET || 'primaria-pociumbauti-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    secure: false, // false для HTTP
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  },
  rolling: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    session: req.session ? 'active' : 'none',
    sessionID: req.sessionID || 'none',
    authenticated: req.session?.logged_in || false
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});
