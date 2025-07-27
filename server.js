const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const CAR_MODEL_API = 'https://serverless.roboflow.com/car-damage-detection-q8a5n/1';
const DAMAGE_API = 'https://serverless.roboflow.com/dammage-detection-in-car/2';
const API_KEY = 'ESXQTWrO0Fus8QF5xOuK';

app.post('/detect', async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    try {
        // Car Model Detection
        const modelRes = await axios.post(
            `${CAR_MODEL_API}?api_key=${API_KEY}`,
            image,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        // Damage Detection
        const damageRes = await axios.post(
            `${DAMAGE_API}?api_key=${API_KEY}`,
            image,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        res.json({
            model: modelRes.data,
            damage: damageRes.data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`)); 