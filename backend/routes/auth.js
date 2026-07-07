const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { isUsingMongoDB, db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'omnisync-secret-jwt-key-2026';

const ROLES_LIST = [
  { id: 'admin', name: 'System Administrator', dept: 'IT Operations', scope: 'global:*', handle: '@admin_ops', avatar: 'SA' },
  { id: 'doctor', name: 'Clinical Director', dept: 'Maternal & Medical Services', scope: 'healthcare:*, maternal:*', handle: '@clinical_dir', avatar: 'CD' },
  { id: 'lawyer', name: 'Legal Counsel', dept: 'Judicial Compliance', scope: 'court:*', handle: '@legal_counsel', avatar: 'LC' },
  { id: 'farmer', name: 'Farm Superintendent', dept: 'Agronomy Operations', scope: 'farming:*', handle: '@farm_super', avatar: 'FS' },
  { id: 'logistics', name: 'Logistics Officer', dept: 'Warehouse & Blockchain Ledger', scope: 'retail:*, supplychain:*', handle: '@logistics_officer', avatar: 'LO' },
  { id: 'citizen', name: 'Citizen Operator', dept: 'Public Hazards & Gestures', scope: 'hazards:*, sign:*', handle: '@citizen_op', avatar: 'CO' }
];

// Helper to hash password
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Helper to sign JWT token
function signToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Database helper functions
async function findUserByEmail(email) {
  if (isUsingMongoDB()) {
    return await User.findOne({ email });
  } else {
    return db.findOne('users', x => x.email === email);
  }
}

async function createUser(userData) {
  if (isUsingMongoDB()) {
    const newUser = new User(userData);
    return await newUser.save();
  } else {
    return db.saveToCollection('users', userData);
  }
}

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, roleId, handle } = req.body;
  if (!email || !password || !roleId) {
    return res.status(400).json({ error: 'Email, password and role are required' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const selectedRole = ROLES_LIST.find(r => r.id === roleId) || ROLES_LIST[5];
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const userData = {
      email,
      passwordHash,
      salt,
      role: {
        id: selectedRole.id,
        name: selectedRole.name,
        dept: selectedRole.dept,
        scope: selectedRole.scope,
        handle: handle || `@${email.split('@')[0]}`,
        avatar: selectedRole.avatar
      }
    };

    const savedUser = await createUser(userData);

    // Sign token immediately upon registration
    const tokenPayload = {
      id: savedUser._id || savedUser.id,
      email: savedUser.email,
      role: savedUser.role
    };
    const token = signToken(tokenPayload, JWT_SECRET);

    res.json({
      success: true,
      user: {
        email: savedUser.email,
        role: savedUser.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokenPayload = {
      id: user._id || user.id,
      email: user.email,
      role: user.role
    };
    const token = signToken(tokenPayload, JWT_SECRET);

    res.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getAllUsers() {
  if (isUsingMongoDB()) {
    return await User.find({}, { passwordHash: 0, salt: 0 });
  } else {
    return db.getCollection('users').map(({ passwordHash, salt, ...rest }) => rest);
  }
}

// Middleware to verify Admin
function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No authorization header provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (payload.role && payload.role.id === 'admin') {
      req.adminUser = payload;
      next();
    } else {
      return res.status(403).json({ error: 'Access restricted to administrators' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authorization token' });
  }
}

// Get all users (Admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create/Provision a new user (Admin only)
router.post('/users', verifyAdmin, async (req, res) => {
  const { email, password, roleId, handle } = req.body;
  if (!email || !password || !roleId) {
    return res.status(400).json({ error: 'Email, password and role are required' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const selectedRole = ROLES_LIST.find(r => r.id === roleId) || ROLES_LIST[5];
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const userData = {
      email,
      passwordHash,
      salt,
      role: {
        id: selectedRole.id,
        name: selectedRole.name,
        dept: selectedRole.dept,
        scope: selectedRole.scope,
        handle: handle || `@${email.split('@')[0]}`,
        avatar: selectedRole.avatar
      }
    };

    const savedUser = await createUser(userData);

    res.json({
      success: true,
      user: {
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
