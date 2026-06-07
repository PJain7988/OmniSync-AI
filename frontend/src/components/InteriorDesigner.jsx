import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RefreshCw, Play, Monitor, Plus, Settings, Users, Percent } from 'lucide-react';

export default function InteriorDesigner({ API_BASE, triggerAlert }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const wallMeshRef = useRef(null);
  const furnitureObjects = useRef([]);

  // States
  const [styleRecommendation, setStyleRecommendation] = useState('nordic');
  const [placedItems, setPlacedItems] = useState([]);
  const [wallColor, setWallColor] = useState('#1a1b26');
  const [vrMode, setVrMode] = useState(false);
  const [collabSync, setCollabSync] = useState(false);

  // Furniture price map for Budget Estimator
  const PRICES = { sofa: 750, table: 320, bed: 1200, chair: 210, lamp: 180, plant: 95 };

  // Calculate total budget
  const totalBudget = placedItems.reduce((acc, type) => acc + (PRICES[type] || 0), 0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth || 600;
    const height = canvasRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f111a);
    scene.fog = new THREE.Fog(0x0f111a, 15, 30);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 6, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    canvasRef.current.innerHTML = '';
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.5);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 0.6, 20);
    pointLight.position.set(-3, 3, -3);
    scene.add(pointLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x1f2335 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Room walls (save ref to update color dynamically)
    const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(wallColor), side: THREE.BackSide });
    const room = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 10), wallMat);
    room.position.y = 2.5;
    room.receiveShadow = true;
    scene.add(room);
    wallMeshRef.current = room;

    const grid = new THREE.GridHelper(12, 24, 0x565f89, 0x24283b);
    grid.position.y = 0.01;
    scene.add(grid);

    // Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let theta = 0.3, phi = 0.8, radius = 12;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      theta -= (e.clientX - prevMouse.x) * 0.005;
      phi = Math.max(0.2, Math.min(1.4, phi - (e.clientY - prevMouse.y) * 0.005));
      prevMouse = { x: e.clientX, y: e.clientY };
      camera.position.set(
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.cos(theta) * Math.sin(phi)
      );
      camera.lookAt(0, 0.5, 0);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const container = canvasRef.current;
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      // If VR mode is on, render a split view (simulate VR goggles camera)
      if (vrMode && rendererRef.current) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        
        // Left Eye
        renderer.setViewport(0, 0, w / 2, h);
        renderer.setScissor(0, 0, w / 2, h);
        renderer.setScissorTest(true);
        camera.position.x -= 0.15;
        renderer.render(scene, camera);
        
        // Right Eye
        renderer.setViewport(w / 2, 0, w / 2, h);
        renderer.setScissor(w / 2, 0, w / 2, h);
        renderer.setScissorTest(true);
        camera.position.x += 0.30;
        renderer.render(scene, camera);
        
        camera.position.x -= 0.15; // reset
      } else {
        renderer.setViewport(0, 0, width, height);
        renderer.setScissorTest(false);
        renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [vrMode]);

  // Update wall color in scene
  useEffect(() => {
    if (wallMeshRef.current) {
      wallMeshRef.current.material.color.set(wallColor);
    }
  }, [wallColor]);

  // Simulate Multiplayer Collab
  useEffect(() => {
    let interval;
    if (collabSync) {
      triggerAlert('push', 'Multiplayer collaboration session opened. User 2 joined.');
      interval = setInterval(() => {
        const simulatedItems = ['plant', 'chair', 'lamp'];
        const chosen = simulatedItems[Math.floor(Math.random() * simulatedItems.length)];
        handleAdd3DItem(chosen, true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [collabSync]);

  const handleAdd3DItem = (type, isFromCollab = false) => {
    if (!sceneRef.current) return;
    const colors = { sofa: 0x00f0ff, table: 0xbd00ff, bed: 0x3b82f6, chair: 0x10b981, lamp: 0xf59e0b, plant: 0x10b981 };
    const sizes = { sofa: [2, 0.7, 0.9], table: [1.2, 0.5, 0.8], bed: [2, 0.6, 1.8], chair: [0.7, 0.9, 0.7], lamp: [0.2, 1.6, 0.2], plant: [0.4, 0.9, 0.4] };
    
    const [w, h, d] = sizes[type] || [0.8, 0.8, 0.8];
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color: colors[type] || 0xcccccc });
    const mesh = new THREE.Mesh(geo, mat);
    
    mesh.position.set((Math.random() - 0.5) * 8, h / 2, (Math.random() - 0.5) * 6);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sceneRef.current.add(mesh);
    furnitureObjects.current.push(mesh);

    setPlacedItems(prev => [...prev, type]);
    
    if (isFromCollab) {
      triggerAlert('push', `Collab User placed: ${type.toUpperCase()}`);
    } else {
      triggerAlert('push', `Placed item: ${type.toUpperCase()} ($${PRICES[type]})`);
    }
  };

  const handleClear3DScene = () => {
    if (!sceneRef.current) return;
    furnitureObjects.current.forEach(obj => {
      sceneRef.current.remove(obj);
    });
    furnitureObjects.current = [];
    setPlacedItems([]);
    triggerAlert('push', 'WebGL Facility grid reset.');
  };

  return (
    <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--accent-cyan)' }}>Facility Spatial Modeler</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Design facility assets, track construction pricing, and review in simulated Stereoscopic VR mode.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleClear3DScene}>Reset Canvas</button>
        </div>
      </div>

      {/* Advanced Control Widgets */}
      <div className="grid-3" style={{ gap: '16px' }}>
        {/* Style selector */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Style recommendations</span>
          <select 
            className="form-control" 
            style={{ width: '100%', padding: '6px', fontSize: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', marginTop: '8px' }}
            value={styleRecommendation}
            onChange={e => {
              setStyleRecommendation(e.target.value);
              triggerAlert('push', `Interior layout updated to ${e.target.value.toUpperCase()} preset.`);
            }}
          >
            <option value="nordic" style={{ background: '#111' }}>Nordic minimalist (Light grey/ash)</option>
            <option value="futuristic" style={{ background: '#111' }}>Cyberpunk / Neon glowing</option>
            <option value="industrial" style={{ background: '#111' }}>Industrial Brick (Dark brick)</option>
          </select>
        </div>

        {/* Budget Counter */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Layout Budget Estimator</span>
          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '20px', color: 'var(--accent-cyan)' }}>${totalBudget.toLocaleString()}</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Items placed: {placedItems.length}</span>
          </div>
        </div>

        {/* VR & Collaboration Toggles */}
        <div className="glass-card" style={{ padding: '14px', textAlign: 'left', display: 'flex', gap: '10px', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={vrMode} 
              onChange={e => setVrMode(e.target.checked)} 
              id="vr-toggle"
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="vr-toggle" style={{ fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🕶️ VR Split Screen (Dual Eye)
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              checked={collabSync} 
              onChange={e => setCollabSync(e.target.checked)} 
              id="collab-toggle"
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="collab-toggle" style={{ fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} /> Live Collaboration Session
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Toolbar */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', width: '220px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px', fontSize: '14px' }}>Spawner controls</h4>
          
          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px' }}>Wall color</label>
            <input 
              type="color" 
              value={wallColor} 
              onChange={e => setWallColor(e.target.value)} 
              style={{ width: '100%', height: '30px', border: 'none', background: 'none', cursor: 'pointer' }} 
            />
          </div>

          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('sofa')}>🛋️ Sofa ($750)</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('table')}>🟫 Coffee Table ($320)</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('bed')}>🛏️ Master Bed ($1200)</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('chair')}>🪑 Living Chair ($210)</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('lamp')}>💡 Tall Lamp ($180)</button>
          <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => handleAdd3DItem('plant')}>🌿 Ornamental Plant ($95)</button>
        </div>

        {/* 3D Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div id="ar-canvas-container" ref={canvasRef} style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', position: 'relative' }} />
          {vrMode && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', color: 'var(--accent-rose)', fontWeight: '700' }}>
              STEREOSCOPIC VR MODE SIMULATOR
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
