const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.post('/vitals', (req, res) => {
  const vitals = req.body;
  const hr = parseFloat(vitals.heart_rate) || 80;
  const spo2 = parseFloat(vitals.spo2) || 98;
  const sys = parseFloat(vitals.blood_pressure_systolic) || 120;
  const dia = parseFloat(vitals.blood_pressure_diastolic) || 80;
  const temp = parseFloat(vitals.temperature) || 36.6;
  const patientId = vitals.patient_id || 'M-001';

  const flags = [];
  const recommendations = [];
  let emergency = false;

  if (sys >= 140 || dia >= 90) {
    flags.push("Hypertension Detected");
    recommendations.push("Retake blood pressure reading in 15 minutes. Limit sodium intake.");
    if (sys >= 160 || dia >= 110) {
      flags.push("Severe Pre-eclampsia Risk");
      recommendations.push("Urgent medical review required immediately.");
      emergency = true;
    }
  }

  if (spo2 < 95) {
    flags.push("Low Oxygen Saturation");
    recommendations.push("Ensure adequate ventilation; seek supplemental oxygen if breathing becomes labored.");
    emergency = true;
  }

  if (hr > 110 || hr < 60) {
    flags.push(hr > 110 ? "Tachycardia" : "Bradycardia");
    recommendations.push("Rest in a side-lying position. Recheck pulse after 10 minutes.");
  }

  if (temp > 38.0) {
    flags.push("High Fever");
    recommendations.push("Monitor core temperature closely. Consult doctor for safe antipyretic medication.");
  }

  if (flags.length === 0) {
    recommendations.push("Vitals are stable. Keep up with hydration and standard supplementation.");
  }

  const assessment = {
    patient_id: patientId,
    timestamp: new Date().toISOString(),
    heart_rate: hr,
    spo2,
    blood_pressure_systolic: sys,
    blood_pressure_diastolic: dia,
    temperature: temp,
    gestational_week: vitals.gestational_week || 24,
    risk_level: emergency ? "High" : (flags.length > 0 ? "Medium" : "Low"),
    flags,
    recommendations,
    emergency
  };

  db.saveToCollection('vitals', assessment);
  res.json(assessment);
});

router.get('/vitals/history/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  const records = db.find('vitals', x => x.patient_id === patient_id);
  res.json(records.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
});

router.post('/kick-count', (req, res) => {
  const { patient_id, kicks, duration_minutes } = req.body;
  const rate = kicks / duration_minutes;
  const alert = rate < 0.5 && duration_minutes >= 60;
  
  const record = {
    patient_id: patient_id || 'M-001',
    timestamp: new Date().toISOString(),
    kicks,
    duration_minutes,
    kicks_per_hour: Math.round(rate * 60 * 10) / 10,
    alert,
    message: alert ? "Reduced fetal movement. Please consult medical providers immediately." : "Fetal activity is normal."
  };

  db.saveToCollection('kickCounts', record);
  res.json(record);
});

router.get('/reminders/:patient_id', (req, res) => {
  res.json([
    { id: 1, medication_name: "Prenatal Multivitamin", dose: "1 capsule", time: "08:00 AM", status: "Taken" },
    { id: 2, medication_name: "Calcium Carbonate", dose: "500 mg", time: "12:30 PM", status: "Pending" },
    { id: 3, medication_name: "Iron (Ferrous Sulfate)", dose: "325 mg", time: "07:00 PM", status: "Pending" }
  ]);
});

module.exports = router;
