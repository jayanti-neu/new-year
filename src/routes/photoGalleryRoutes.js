const express = require('express');

const router = express.Router();

// Mock data
let photos = [
    { id: 1, title: 'Photo 1', url: 'http://example.com/photo1.jpg' },
    { id: 2, title: 'Photo 2', url: 'http://example.com/photo2.jpg' }
];

// GET /api/photos: Get all photos
router.get('/api/photos', (req, res) => {
    res.json(photos);
});

// GET /api/photos/:id: Get a specific photo by ID
router.get('/api/photos/:id', (req, res) => {
    const photo = photos.find(p => p.id === parseInt(req.params.id));
    if (!photo) return res.status(404).send('Photo not found');
    res.json(photo);
});

// POST /api/photos: Upload a new photo
router.post('/api/photos', (req, res) => {
    const newPhoto = {
        id: photos.length + 1,
        title: req.body.title,
        url: req.body.url
    };
    photos.push(newPhoto);
    res.status(201).json(newPhoto);
});

// PUT /api/photos/:id: Update an existing photo by ID
router.put('/api/photos/:id', (req, res) => {
    const photo = photos.find(p => p.id === parseInt(req.params.id));
    if (!photo) return res.status(404).send('Photo not found');

    photo.title = req.body.title;
    photo.url = req.body.url;
    res.json(photo);
});

// DELETE /api/photos/:id: Delete a photo by ID
router.delete('/api/photos/:id', (req, res) => {
    const photoIndex = photos.findIndex(p => p.id === parseInt(req.params.id));
    if (photoIndex === -1) return res.status(404).send('Photo not found');

    const deletedPhoto = photos.splice(photoIndex, 1);
    res.json(deletedPhoto);
});

module.exports = router;