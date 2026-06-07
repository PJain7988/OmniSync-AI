const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  res.json(db.find('inventory'));
});

router.post('/item', (req, res) => {
  const item = req.body;
  if (!item.sku || !item.name) return res.status(400).json({ error: 'SKU and Name are required' });
  const saved = db.saveToCollection('inventory', item);
  res.json(saved);
});

router.post('/optimize', async (req, res) => {
  const items = db.find('inventory');
  
  const reports = items.map(item => {
    const baselineDaily = Math.max(1, Math.round(item.current_stock / 10));
    const forecast_7d = Array.from({ length: 7 }, () => Math.round(baselineDaily * (0.8 + Math.random() * 0.4)));
    const forecast_30d = forecast_7d.reduce((a, b) => a + b, 0) * 4;

    const reorder_needed = item.current_stock <= item.reorder_point;
    const suggested_order_qty = reorder_needed ? Math.max(0, item.max_stock - item.current_stock) : 0;

    let discountOrPremium = 1.0;
    let stockout_risk = "Low";
    let overstock_risk = "Low";

    if (item.current_stock < item.reorder_point * 0.5) {
      stockout_risk = "High";
      discountOrPremium = 1.15;
    } else if (item.current_stock > item.max_stock * 0.8) {
      overstock_risk = "High";
      discountOrPremium = 0.85;
    }
    const dynamic_price = Math.round(item.unit_cost * 1.5 * discountOrPremium * 100) / 100;

    return {
      sku: item.sku,
      name: item.name,
      current_stock: item.current_stock,
      forecast_7d,
      forecast_30d,
      reorder_needed,
      suggested_order_qty,
      stockout_risk,
      overstock_risk,
      dynamic_price
    };
  });

  res.json(reports);
});

module.exports = router;
