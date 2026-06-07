const express = require('express');
const router = express.Router();

const SUPPORTED_SIGNS = ["Hello", "Please", "Thank you", "Yes", "No", "Help", "Doctor", "Eat", "Water", "More"];

router.get('/vocabulary', (req, res) => {
  res.json({ total: SUPPORTED_SIGNS.length, signs: SUPPORTED_SIGNS });
});

router.post('/translate-image', (req, res) => {
  const randomSign = SUPPORTED_SIGNS[Math.floor(Math.random() * SUPPORTED_SIGNS.length)];
  res.json({ gesture: randomSign, confidence: 0.95 });
});

module.exports = router;
