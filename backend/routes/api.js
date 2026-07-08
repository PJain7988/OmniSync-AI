const express = require('express');
const router = express.Router();
const { isUsingMongoDB } = require('../db');

// Import individual sub-routers
const socialMediaRouter = require('./socialMedia');
const courtOrderRouter = require('./courtOrder');
const healthcareRouter = require('./healthcare');
const farmingRouter = require('./farming');
const inventoryRouter = require('./inventory');
const interiorRouter = require('./interior');
const supplyChainRouter = require('./supplyChain');
const maternalRouter = require('./maternal');
const hazardsRouter = require('./hazards');
const signLanguageRouter = require('./signLanguage');
const copilotRouter = require('./copilot');
const authRouter = require('./auth');

// Create v1 router
const v1Router = express.Router();

// Mount sub-routers under domain namespaces on v1
v1Router.use('/auth', authRouter);
v1Router.use('/social-profiles', socialMediaRouter);
v1Router.use('/legal/court-orders', courtOrderRouter);
v1Router.use('/healthcare', healthcareRouter);
v1Router.use('/agriculture', farmingRouter);
v1Router.use('/logistics/inventory', inventoryRouter);
v1Router.use('/interior', interiorRouter);
v1Router.use('/logistics/shipments', supplyChainRouter);
v1Router.use('/healthcare/maternal', maternalRouter);
v1Router.use('/infrastructure/hazards', hazardsRouter);
v1Router.use('/sign-language', signLanguageRouter);
v1Router.use('/ai/copilot', copilotRouter);

// Central Health Check Endpoint (on v1)
v1Router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isUsingMongoDB() ? 'MongoDB' : 'Local JSON File',
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    memory_usage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount v1 onto root router
router.use('/v1', v1Router);

// Fallback for root api (optional redirect or message)
router.get('/', (req, res) => res.json({ message: 'Welcome to OmniSync API. Please use /api/v1' }));
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isUsingMongoDB() ? 'MongoDB' : 'Local JSON File',
    timestamp: new Date().toISOString(),
    note: 'Redirected internally to v1'
  });
});

module.exports = router;
