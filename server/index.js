const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes      = require('./routes/auth');
const storyRoutes     = require('./routes/stories');
const aiRoutes        = require('./routes/ai');
const userRoutes      = require('./routes/users');
const favoritesRoutes = require('./routes/favorites');
const contactRoutes   = require('./routes/contact');
const { seedAnonymousUser } = require('./seeds/anonymousUser');

const app = express();

app.set('trust proxy', 1);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS: not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Story generation limit reached. Please try again in an hour.' },
});
app.use('/api/ai/', aiLimiter);

// ─── MongoDB Bağlantısı (serverless için cache'leme) ─────────────────────────
let seedDone = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  if (!seedDone) {
    await seedAnonymousUser();
    seedDone = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ─── Rotalar ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/stories',   storyRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/contact',   contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── Hata İşleyiciler ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Yerel Geliştirme Sunucusu ────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('✅ MongoDB connected');
      await seedAnonymousUser();
      seedDone = true;
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
