const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/track/:product_id', (req, res) => {
  const { product_id } = req.params;
  const history = db.find('supplyChain', x => x.product_id === product_id);
  if (history.length === 0) {
    const mockHistory = [
      {
        product_id,
        step_name: "Manufactured",
        handler: "GreenTech Assembly Lab",
        location: "Stuttgart, Germany",
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        tx_hash: "0x" + Math.random().toString(16).substr(2, 40)
      },
      {
        product_id,
        step_name: "Dispatched from Factory",
        handler: "LogiCargo Europe",
        location: "Stuttgart Port",
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        tx_hash: "0x" + Math.random().toString(16).substr(2, 40)
      },
      {
        product_id,
        step_name: "Import Custom Cleared",
        handler: "Customs Authority",
        location: "New York Hub",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        tx_hash: "0x" + Math.random().toString(16).substr(2, 40)
      }
    ];
    mockHistory.forEach(step => db.saveToCollection('supplyChain', step));
    return res.json(mockHistory);
  }
  res.json(history.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
});

router.post('/step', (req, res) => {
  const { product_id, step_name, handler, location } = req.body;
  if (!product_id || !step_name) return res.status(400).json({ error: 'product_id and step_name are required' });

  const step = {
    product_id,
    step_name,
    handler: handler || "Generic Handler",
    location: location || "Global Transit",
    timestamp: new Date().toISOString(),
    tx_hash: "0x" + Array.from({length:40}, () => Math.floor(Math.random()*16).toString(16)).join('')
  };

  db.saveToCollection('supplyChain', step);
  res.json({ success: true, step });
});

module.exports = router;
