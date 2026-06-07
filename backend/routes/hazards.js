const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// Ensure uploads folder exists
if (!fs.existsSync(path.join(__dirname, '../uploads/'))) {
  fs.mkdirSync(path.join(__dirname, '../uploads/'), { recursive: true });
}

router.post('/report', upload.single('image'), (req, res) => {
  const { latitude, longitude, description, hazard_type } = req.body;
  
  const lat = parseFloat(latitude) || (28.6 + (Math.random() - 0.5) * 0.1);
  const lon = parseFloat(longitude) || (77.2 + (Math.random() - 0.5) * 0.1);

  const reportId = "HAZ-" + Math.floor(1000 + Math.random() * 9000);
  const severities = ["Low", "Medium", "High"];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const newReport = {
    id: reportId,
    latitude: lat,
    longitude: lon,
    description: description || "No description provided.",
    hazard_type: hazard_type || "pothole",
    severity,
    status: "Reported",
    votes: 0,
    created_at: new Date().toISOString(),
    image_url: req.file ? `/uploads/${req.file.filename}` : null
  };

  db.saveToCollection('hazards', newReport);
  res.json({ success: true, report: newReport });
});

router.get('/list', (req, res) => {
  let list = db.find('hazards');
  if (list.length === 0) {
    const mock = [
      { id: "HAZ-1294", latitude: 28.6139, longitude: 77.2090, hazard_type: "pothole", severity: "High", description: "Large deep pothole in the middle lane.", status: "Reported", votes: 14, created_at: new Date(Date.now()-86400000*2).toISOString(), image_url: null },
      { id: "HAZ-8492", latitude: 28.6210, longitude: 77.2201, hazard_type: "surface crack", severity: "Medium", description: "Widespread thermal cracks causing vehicle bumps.", status: "In Progress", votes: 8, created_at: new Date(Date.now()-86400000).toISOString(), image_url: null },
      { id: "HAZ-3320", latitude: 28.6012, longitude: 77.1895, hazard_type: "debris", severity: "Low", description: "Construction debris spilled on shoulder.", status: "Fixed", votes: 3, created_at: new Date(Date.now()-86400000*5).toISOString(), image_url: null }
    ];
    mock.forEach(item => db.saveToCollection('hazards', item));
    list = mock;
  }
  res.json(list);
});

router.post('/vote/:id', (req, res) => {
  const { id } = req.params;
  const item = db.findOne('hazards', x => x.id === id);
  if (!item) return res.status(404).json({ error: 'Report not found' });
  item.votes = (item.votes || 0) + 1;
  db.saveToCollection('hazards', item);
  res.json({ success: true, votes: item.votes });
});

router.patch('/status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ["Reported", "Acknowledged", "In Progress", "Fixed", "Closed"];
  if (!valid.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` });

  const item = db.findOne('hazards', x => x.id === id);
  if (!item) return res.status(404).json({ error: 'Report not found' });
  
  item.status = status;
  db.saveToCollection('hazards', item);
  res.json({ success: true, report: item });
});

module.exports = router;
