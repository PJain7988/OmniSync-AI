import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, MessageSquare, BarChart, ShoppingCart, HelpCircle } from 'lucide-react';

export default function InventoryManager({ API_BASE, triggerAlert }) {
  const [inventoryList, setInventoryList] = useState([]);
  const [retailReports, setRetailReports] = useState(null);
  const [retailLoading, setRetailLoading] = useState(false);
  const [newItem, setNewItem] = useState({ sku: '', name: '', current_stock: 50, reorder_point: 20, max_stock: 100, unit_cost: 15.0 });

  // Multi-Agent Conversation transcript simulator
  const [agentLogs, setAgentLogs] = useState([
    { agent: "Agent 1 (Demand Analysis)", text: "Scanning regional marketplace indicators. Upward trend of +15% expected for solar units.", color: "var(--accent-cyan)" },
    { agent: "Agent 2 (Stock Monitoring)", text: "Checking local inventory registers. SKU-101 is currently at 15 units (Below Reorder Point: 20).", color: "var(--accent-blue)" }
  ]);

  const loadInventory = () => {
    fetch(`${API_BASE}/logistics/inventory`)
      .then(res => res.json())
      .then(data => setInventoryList(data))
      .catch(console.error);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const triggerInventoryOptimization = async () => {
    setRetailLoading(true);
    try {
      const response = await fetch(`${API_BASE}/logistics/inventory/optimization`, { method: 'POST' });
      const data = await response.json();
      setRetailReports(data);
      triggerAlert('push', 'Warehouse stock replenishment thresholds recalculated.');
      
      // Simulate subsequent agent dialogues
      setAgentLogs(prev => [
        ...prev,
        { agent: "Agent 3 (Supplier Comms)", text: "Auto-generating replenishment order (+50 units) to primary vendor 'Solar Assemble Corp'.", color: "var(--accent-emerald)" },
        { agent: "Agent 4 (Pricing Optimization)", text: "Inventory loading low. Adjusting Dynamic Unit Price from $22.50 to $24.99 to maximize yield.", color: "var(--accent-purple)" }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setRetailLoading(false);
    }
  };

  const handleAddInventoryItem = async () => {
    if (!newItem.sku || !newItem.name) return;
    try {
      const response = await fetch(`${API_BASE}/inventory/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const saved = await response.json();
      setInventoryList(prev => [...prev.filter(x => x.sku !== saved.sku), saved]);
      setNewItem({ sku: '', name: '', current_stock: 50, reorder_point: 20, max_stock: 100, unit_cost: 15.0 });
      triggerAlert('push', `New SKU ${newItem.sku} registered.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-blue)' }}>Warehouse Stock Controller</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Predict consumer demand, orchestrate autonomous procurement agents, and adjust dynamically priced goods.</p>
        </div>
        <button className="btn btn-primary" onClick={triggerInventoryOptimization} disabled={retailLoading}>
          {retailLoading ? <RefreshCw className="spinner" size={16} /> : 'Optimize Inventory Stock'}
        </button>
      </div>

      {/* Multi-Agent Orchestration & Analytics Charts */}
      <div className="grid-2">
        {/* Multi-Agent Panel */}
        <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={16} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '15px' }}>Multi-Agent Procurement Chat logs</h3>
          </div>
          
          <div style={{ height: '140px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--glass-border)' }}>
            {agentLogs.map((log, idx) => (
              <div key={idx} style={{ borderLeft: `2px solid ${log.color}`, paddingLeft: '8px' }}>
                <strong style={{ color: log.color }}>{log.agent}:</strong>
                <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{log.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Insights / Forecast Chart */}
        <div className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart size={16} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '15px' }}>Sales Analytics & Profit Insights</h3>
          </div>
          
          <div style={{ height: '140px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>Gross Profit: <strong>$14,230</strong></span>
              <span style={{ color: 'var(--accent-emerald)' }}>Forecast Confidence: 94.2%</span>
            </div>
            {/* SVG Sales forecasting comparison graph */}
            <div style={{ height: '70px', display: 'flex', alignItems: 'flex-end' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
                {/* Target line */}
                <path d="M 0 50 L 50 45 L 100 48 L 150 35 L 200 25 L 250 20 L 300 15" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeDasharray="3 3" />
                {/* Actual line */}
                <path d="M 0 50 L 50 47 L 100 40 L 150 38 L 200 22 L 250 24 L 300 10" fill="none" stroke="var(--accent-purple)" strokeWidth="2" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '9px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '2px', background: 'var(--accent-cyan)' }} /> Simulated Demand</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '2px', background: 'var(--accent-purple)' }} /> Actual Gross Sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <h3 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '16px' }}>Current Warehouse Inventory</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Stock Level</th>
              <th>Reorder Limit</th>
              <th>Dynamic Price</th>
              <th>Forecast (30d)</th>
              <th>Procurement Trigger</th>
            </tr>
          </thead>
          <tbody>
            {(inventoryList || []).map(item => {
              const report = retailReports?.find(r => r.sku === item.sku);
              return (
                <tr key={item.sku}>
                  <td><code>{item.sku}</code></td>
                  <td>{item.name}</td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{item.current_stock}</span> / {item.max_stock}
                    {item.current_stock <= item.reorder_point && (
                      <span className="badge badge-danger" style={{ marginLeft: '8px', fontSize: '10px' }}>Low Stock</span>
                    )}
                  </td>
                  <td>{item.reorder_point}</td>
                  <td>${report ? report.dynamic_price : (item.unit_cost * 1.5).toFixed(2)}</td>
                  <td>{report ? report.forecast_30d : '74'}</td>
                  <td>
                    {report?.reorder_needed || item.current_stock <= item.reorder_point ? (
                      <button className="btn btn-primary" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={() => alert(`Auto Purchase Order sent to Supplier for ${item.name} (+50 units).`)}>
                        Trigger Restock
                      </button>
                    ) : (
                      <span style={{ color: 'var(--accent-emerald)', fontSize: '12px' }}>Stable Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Register Item */}
      <div className="glass-card" style={{ textAlign: 'left' }}>
        <h3>Add New Product</h3>
        <div className="grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>SKU</label>
            <input type="text" className="form-control" value={newItem.sku} onChange={e => setNewItem({ ...newItem, sku: e.target.value })} placeholder="SKU-100" />
          </div>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" className="form-control" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Solar Panel B" />
          </div>
          <div className="form-group">
            <label>Stock Count</label>
            <input type="number" className="form-control" value={newItem.current_stock} onChange={e => setNewItem({ ...newItem, current_stock: parseInt(e.target.value) })} />
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleAddInventoryItem}>Register Product</button>
      </div>
    </section>
  );
}
