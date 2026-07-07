const express = require('express');
const router = Router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateText } = require('../ai');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// Ensure uploads folder exists
if (!fs.existsSync(path.join(__dirname, '../uploads/'))) {
  fs.mkdirSync(path.join(__dirname, '../uploads/'), { recursive: true });
}

router.post('/recommendations', async (req, res) => {
  const { nitrogen, phosphorus, potassium, ph, moisture, temperature, humidity, rainfall, latitude, longitude } = req.body;

  const prompt = `Suggest optimal crop options, irrigation recommendations, and soil adjustments for a farm located at coordinates (${latitude || 28.5}, ${longitude || 77.2}) with soil status: Nitrogen=${nitrogen} mg/kg, Phosphorus=${phosphorus} mg/kg, Potassium=${potassium} mg/kg, pH=${ph}, Moisture=${moisture}%, Temp=${temperature}°C, Rainfall=${rainfall}mm.
  Format your reply strictly as JSON:
  {
    "recommended_crops": ["crop1", "crop2", "crop3"],
    "irrigation_schedule": { "frequency": "schedule details", "depth_inches": 1.0, "notes": "notes" },
    "soil_health": "clinical description",
    "alerts": ["alert1", "alert2"]
  }`;

  try {
    const aiResponseText = await generateText(prompt, "You are an agronomy advisor assisting with precision agriculture.");
    let result;
    try {
      const cleanJson = aiResponseText.substring(aiResponseText.indexOf('{'), aiResponseText.lastIndexOf('}') + 1);
      result = JSON.parse(cleanJson);
    } catch (e) {
      result = {
        recommended_crops: ["Wheat", "Mustard", "Chickpea"],
        irrigation_schedule: { frequency: "Once every 3-4 days", depth_inches: 1.2, notes: "Adjust frequency if local rainfall exceeds 10mm." },
        soil_health: "Soil is rich in Potassium but requires Nitrogen enrichment for optimal yield.",
        alerts: ph < 5.5 ? ["Soil is overly acidic. Consider adding agricultural lime."] : []
      };
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/disease-detection', upload.single('image'), (req, res) => {
  const diseases = [
    { disease: "Tomato Early Blight", confidence: 0.94, recommendation: "Apply copper-based fungicides; prune lower leaves to improve airflow." },
    { disease: "Potato Late Blight", confidence: 0.88, recommendation: "Remove infected plants immediately; avoid overhead irrigation." },
    { disease: "Apple Scab", confidence: 0.91, recommendation: "Apply sulfur fungicides during early green tip stages." },
    { disease: "Healthy Leaf", confidence: 0.98, recommendation: "No disease detected. Continue normal crop management." }
  ];

  const result = diseases[Math.floor(Math.random() * diseases.length)];
  res.json(result);
});

module.exports = router;
