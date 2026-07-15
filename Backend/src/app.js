const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
// Allow the local dev frontend plus the deployed frontend (set FRONTEND_URL on
// the backend host, e.g. https://interview-ai-ten-nu.vercel.app).
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// require all routes here
const authRoutes = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');
// using all the routes here
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRouter);

module.exports = app;