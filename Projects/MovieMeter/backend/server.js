const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { processMovieData } = require('./scoringEngine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/movies', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
        const processedData = data.map(movie => processMovieData(movie));
        res.json(processedData);
    } catch (error) {
        console.error('Error reading/processing movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/movies/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
        const movie = data.find(m => m.id === parseInt(req.params.id, 10));
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const processedMovie = processMovieData(movie);
        res.json(processedMovie);
    } catch (error) {
        console.error('Error reading/processing movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`MovieMeter backend running on http://localhost:${PORT}`);
});
