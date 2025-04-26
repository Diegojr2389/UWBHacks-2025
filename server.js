const express = require('express');
const cors = require('cors');
const turf = require('@turf/turf');
const fs = require('fs');

//require('dotenv').config();
//const url = 'https://data.seattle.gov/resource/tazs-3rd5.json';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const HIGH_RISK_THRESHOLD = 25; // Number of incidents to trigger alert

const beatData = JSON.parse(fs.readFileSync('Seattle-Police-Beats.geojson', 'utf-8'));
const crimeData = JSON.parse(fs.readFileSync('seattlecrimedata.json', 'utf-8'));
const crimeCounts = new Map(); // Lookup table for number of incidents per beat

for (const incident of crimeData) {
    const beat = incident.beat;
    if (!beat) continue;
    crimeCounts.set(beat, (crimeCounts.get(beat) || 0) + 1);
  }

app.post('/check-location', (req, res) => {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json('Invalid coordinates.'); //404 Bad request error
    }

    const userPoint = turf.point([longitude, latitude]);

    let userBeat = null; //Beat corresponding to user's location

    for (const feature of beatData.features) {
        // const polygon = feature.geometry;
        if (turf.booleanPointInPolygon(userPoint, turf.feature(feature.geometry))) {
            userBeat = feature.properties.BEAT;
            break;
        }
    }

    if (!userBeat) {
        return res.json({ message: 'Location not in any known beat.', alert: false });
    }

    const incidentCount = crimeCounts.get(userBeat) || 0;

    if (incidentCount >= HIGH_RISK_THRESHOLD) {
        return res.json({
            message: `High risk area detected (Beat ${userBeat}) with ${incidentCount} incidents.`,
            alert: true,
            beat: userBeat,
            incidentCount: incidentCount
        });
    } else {
        return res.json({
            message: `Area is relatively safe (Beat ${userBeat}) with ${incidentCount} incidents.`,
            alert: false,
            beat: userBeat,
            incidentCount: incidentCount
        });
      }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

