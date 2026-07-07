require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const { connectDB, seedInitialCredentials } = require('./db');
const apiRouter = require('./routes/api');

const app = express();

// Middlewares
app.use(cors({
  origin: ['https://omni-sync-ai.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Serving uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Unified API Router
app.use('/api', apiRouter);

// ── Serve built React frontend in production ──────────────────────────────
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  // SPA fallback — return index.html for any non-API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
  console.log('[Server] Serving frontend from:', FRONTEND_DIST);
}

// Create HTTP Server & WebSocket Server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const SUPPORTED_SIGNS = ["Hello", "Please", "Thank you", "Yes", "No", "Help", "Doctor", "Eat", "Water", "More"];

// WebSocket Gesture translation handler
wss.on('connection', (ws) => {
  console.log('[WebSocket] Client connected for Sign Language streaming.');
  let sequenceBuffer = [];

  ws.on('message', async (message) => {
    try {
      const msg = JSON.parse(message);

      if (msg.type === 'frame') {
        const simulatedGesture = SUPPORTED_SIGNS[Math.floor(Math.random() * SUPPORTED_SIGNS.length)];
        sequenceBuffer.push(simulatedGesture);

        if (sequenceBuffer.length >= 4) {
          const sentences = {
            "Hello-Please-Water-Thank you": "Hello, please give me some water. Thank you.",
            "Hello-Doctor-Help-Please": "Hello doctor, please help me.",
            "No-Eat-More-Thank you": "No, I do not want to eat more. Thank you."
          };
          const key = sequenceBuffer.join('-');
          const sentence = sentences[key] || `I need ${sequenceBuffer[2] || 'Help'} and ${sequenceBuffer[3] || 'Water'}.`;
          sequenceBuffer = []; // reset

          ws.send(JSON.stringify({
            type: 'sentence',
            text: sentence,
            confidence: 0.93
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'gesture',
            label: simulatedGesture,
            buffer_size: sequenceBuffer.length
          }));
        }
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => {
    console.log('[WebSocket] Client disconnected.');
  });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  (async () => {
    await connectDB();          // Step 1 — connect (idempotent)
    await seedInitialCredentials(); // Step 2 — seed once
    server.listen(PORT, () => {
      console.log(`[Server] OmniSync server running on port ${PORT}`);
    });
  })();
}

module.exports = app;
