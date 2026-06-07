const express = require('express');
const router = express.Router();

router.get('/presets', (req, res) => {
  res.json({
    rooms: [
      { id: 'living', name: 'Cozy Living Room', dimensions: [12, 5, 10], baseColor: '#f5f0e8' },
      { id: 'bedroom', name: 'Modern Bedroom', dimensions: [10, 4, 10], baseColor: '#e3edf7' },
      { id: 'office', name: 'Minimalist Office', dimensions: [8, 4, 8], baseColor: '#e8ecef' }
    ],
    items: [
      { type: 'sofa', name: 'Sofa', color: '#4a90d9', dimensions: [2, 0.7, 0.9] },
      { type: 'table', name: 'Coffee Table', color: '#8b6914', dimensions: [1.2, 0.5, 0.8] },
      { type: 'bed', name: 'Bed', color: '#d4696b', dimensions: [2, 0.6, 1.8] },
      { type: 'chair', name: 'Chair', color: '#6db56d', dimensions: [0.7, 0.9, 0.7] },
      { type: 'lamp', name: 'Floor Lamp', color: '#ffd700', dimensions: [0.15, 1.6, 0.15] },
      { type: 'plant', name: 'Indoor Plant', color: '#2d8a2d', dimensions: [0.4, 0.9, 0.4] }
    ]
  });
});

module.exports = router;
