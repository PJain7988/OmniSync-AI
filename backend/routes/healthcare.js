const express = require('express');
const router = express.Router();
const { generateText } = require('../ai');

router.post('/patients/predictions', async (req, res) => {
  const patient = req.body;
  
  const age = parseFloat(patient.age) || 45;
  const bmi = parseFloat(patient.bmi) || 24;
  const bp = parseFloat(patient.blood_pressure) || 120;
  const glucose = parseFloat(patient.glucose) || 90;
  const smoking = parseInt(patient.smoking) || 0;
  const previousAdmissions = parseInt(patient.previous_admissions) || 0;

  let heartRisk = Math.min(0.95, (age * 0.005) + (bp > 140 ? 0.2 : 0.05) + (smoking ? 0.15 : 0) + (bmi > 30 ? 0.1 : 0.02));
  let diabetesRisk = Math.min(0.95, (glucose > 125 ? 0.6 : (glucose > 100 ? 0.3 : 0.05)) + (bmi > 27 ? 0.15 : 0.02));
  let readmissionRisk = Math.min(0.90, (previousAdmissions * 0.2) + (age > 65 ? 0.15 : 0.05));

  const condition_risk = {
    heart_disease: Math.round(heartRisk * 100) / 100,
    diabetes: Math.round(diabetesRisk * 100) / 100,
    readmission: Math.round(readmissionRisk * 100) / 100
  };

  const maxRisk = Math.max(heartRisk, diabetesRisk, readmissionRisk);
  const risk_level = maxRisk > 0.7 ? "High" : (maxRisk > 0.4 ? "Medium" : "Low");

  const prompt = `A patient with age=${age}, bmi=${bmi}, Blood Pressure=${bp}, Glucose=${glucose}, smoking=${smoking}, previousAdmissions=${previousAdmissions} has calculated risk coefficients: Heart Disease=${condition_risk.heart_disease}, Diabetes=${condition_risk.diabetes}, Readmission=${condition_risk.readmission}. List the top 3 risk factors and draft a brief clinical recommendation (max 2 sentences). Format as JSON: {"factors": ["factor 1", "factor 2", "factor 3"], "recommendation": "text"}`;

  try {
    const aiResponseText = await generateText(prompt, "You are a clinical risk advisory agent.");
    let parsedResult;
    try {
      const cleanJson = aiResponseText.substring(aiResponseText.indexOf('{'), aiResponseText.lastIndexOf('}') + 1);
      parsedResult = JSON.parse(cleanJson);
    } catch (e) {
      parsedResult = {};
    }

    const finalFactors = parsedResult.factors || parsedResult.risk_factors || [
      "Age group susceptibility", 
      bmi > 25 ? "Elevated BMI" : "Baseline metabolism", 
      glucose > 100 ? "Prediabetic blood sugar" : "Lifestyle factors"
    ];

    const finalRecommendation = parsedResult.recommendation || parsedResult.recommendations || (
      maxRisk > 0.6 ? "Schedule a clinical consult immediately and request cardiovascular screening." : "Advise regular physical activity and monitoring."
    );

    res.json({
      patient_id: patient.patient_id || 'P-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      condition_risk,
      risk_level,
      top_risk_factors: finalFactors,
      recommendation: finalRecommendation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
