const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const JSON_DB_PATH = path.join(DB_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize JSON database if not exists
if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify({
    vitals: [],
    kickCounts: [],
    hazards: [],
    supplyChain: [],
    inventory: [
      { sku: "SKU-001", name: "Premium Solar Panels", current_stock: 45, reorder_point: 20, max_stock: 100, unit_cost: 250.0, lead_time_days: 5 },
      { sku: "SKU-002", name: "Smart Drip Irrigation Kit", current_stock: 12, reorder_point: 15, max_stock: 50, unit_cost: 89.9, lead_time_days: 3 },
      { sku: "SKU-003", name: "Organic NPK Fertilizer (25kg)", current_stock: 80, reorder_point: 30, max_stock: 150, unit_cost: 15.5, lead_time_days: 4 },
      { sku: "SKU-004", name: "IoT Soil Moisture Sensor", current_stock: 8, reorder_point: 10, max_stock: 30, unit_cost: 34.9, lead_time_days: 2 }
    ],
    socialProfiles: [],
    courtOrders: []
  }, null, 2));
}

let isUsingMongoDB = false;

async function seedInitialCredentials() {
  try {
    const credPath = path.join(__dirname, '../initial_credentials.json');
    if (!fs.existsSync(credPath)) {
      console.log('[Seeding] No initial_credentials.json found. Skipping.');
      return;
    }

    const raw = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    // Support both a single object and an array of credential objects
    const credList = Array.isArray(raw) ? raw : [raw];

    const User = require('./models/User');
    const crypto = require('crypto');

    function hashPassword(pwd, salt) {
      return crypto.pbkdf2Sync(pwd, salt, 1000, 64, 'sha512').toString('hex');
    }

    const ROLES_LIST = [
      { id: 'admin',     name: 'System Administrator', dept: 'IT Operations',                   scope: 'global:*',                  handle: '@admin_ops',         avatar: 'SA' },
      { id: 'doctor',    name: 'Clinical Director',    dept: 'Maternal & Medical Services',      scope: 'healthcare:*, maternal:*',  handle: '@clinical_dir',      avatar: 'CD' },
      { id: 'lawyer',    name: 'Legal Counsel',        dept: 'Judicial Compliance',              scope: 'court:*',                   handle: '@legal_counsel',     avatar: 'LC' },
      { id: 'farmer',    name: 'Farm Superintendent',  dept: 'Agronomy Operations',              scope: 'farming:*',                 handle: '@farm_super',        avatar: 'FS' },
      { id: 'logistics', name: 'Logistics Officer',    dept: 'Warehouse & Blockchain Ledger',    scope: 'retail:*, supplychain:*',   handle: '@logistics_officer', avatar: 'LO' },
      { id: 'citizen',   name: 'Citizen Operator',     dept: 'Public Hazards & Gestures',        scope: 'hazards:*, sign:*',         handle: '@citizen_op',        avatar: 'CO' }
    ];

    let seeded = 0;
    let skipped = 0;

    for (const cred of credList) {
      const { email, password, roleId, handle } = cred;

      if (!email || !password || !roleId) {
        console.warn(`[Seeding] Skipping entry with missing fields: ${JSON.stringify(cred)}`);
        skipped++;
        continue;
      }

      // Check if user already exists
      let existing;
      if (isUsingMongoDB) {
        existing = await User.findOne({ email });
      } else {
        existing = localDB.findOne('users', x => x.email === email);
      }

      if (existing) {
        console.log(`[Seeding] Already exists, skipping: ${email}`);
        skipped++;
        continue;
      }

      const selectedRole = ROLES_LIST.find(r => r.id === roleId) || ROLES_LIST[0];
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);

      const userData = {
        email,
        passwordHash,
        salt,
        role: {
          id:     selectedRole.id,
          name:   selectedRole.name,
          dept:   selectedRole.dept,
          scope:  selectedRole.scope,
          handle: handle || `@${email.split('@')[0]}`,
          avatar: selectedRole.avatar
        }
      };

      if (isUsingMongoDB) {
        const newUser = new User(userData);
        await newUser.save();
      } else {
        localDB.saveToCollection('users', userData);
      }

      console.log(`[Seeding] ✔ Provisioned: ${email} (${selectedRole.name})`);
      seeded++;
    }

    console.log(`[Seeding] Done — ${seeded} new user(s) seeded, ${skipped} skipped.`);
  } catch (err) {
    console.error('[Seeding] Error seeding initial credentials:', err);
  }
}

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnisync';
  try {
    console.log(`[Database] Attempting to connect to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isUsingMongoDB = true;
    console.log('[Database] Successfully connected to MongoDB.');
  } catch (error) {
    console.warn('[Database] MongoDB connection failed or service not running. Falling back to local JSON File Database.');
    isUsingMongoDB = false;
  }
  
  // Run seed check immediately after connection selection
  await seedInitialCredentials();
}

const localDB = {
  read: () => {
    try {
      const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  },
  write: (data) => {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  },
  getCollection: (collectionName) => {
    const data = localDB.read();
    if (!data[collectionName]) {
      data[collectionName] = [];
      localDB.write(data);
    }
    return data[collectionName];
  },
  saveToCollection: (collectionName, item) => {
    const data = localDB.read();
    if (!data[collectionName]) data[collectionName] = [];
    
    const idx = data[collectionName].findIndex(x => (x.id === item.id || x._id === item._id || (x.sku && x.sku === item.sku) || (x.product_id && x.product_id === item.product_id)));
    if (idx > -1) {
      data[collectionName][idx] = { ...data[collectionName][idx], ...item };
    } else {
      if (!item.id && !item._id) item._id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      data[collectionName].push(item);
    }
    localDB.write(data);
    return item;
  },
  find: (collectionName, filterFn = () => true) => {
    return localDB.getCollection(collectionName).filter(filterFn);
  },
  findOne: (collectionName, filterFn) => {
    return localDB.getCollection(collectionName).find(filterFn);
  }
};

module.exports = {
  connectDB,
  isUsingMongoDB: () => isUsingMongoDB,
  db: localDB
};
