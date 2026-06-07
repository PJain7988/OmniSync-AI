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

// Mount sub-routers under domain namespaces
router.use('/social-media', socialMediaRouter);
router.use('/court-order', courtOrderRouter);
router.use('/healthcare', healthcareRouter);
router.use('/farming', farmingRouter);
router.use('/inventory', inventoryRouter);
router.use('/interior', interiorRouter);
router.use('/supply-chain', supplyChainRouter);
router.use('/maternal', maternalRouter);
router.use('/hazards', hazardsRouter);
router.use('/sign-language', signLanguageRouter);
router.use('/copilot', copilotRouter);

// Central Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isUsingMongoDB() ? 'MongoDB' : 'Local JSON File',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
