const express = require('express');
const router = express.Router();
const db = require('../firebase').db;

const weddingDetailsCollection = db.collection('weddingDetailsCollection');

// GET /api/details: Get the wedding details object
router.get('/', async (req, res) => {
    try {
        const doc = await weddingDetailsCollection.doc('details').get();
        if (!doc.exists) return res.status(404).send('Details not found');
        const data = doc.data();
        data.date = data.date.toDate();
        res.json(doc.data());
    } catch (error) {
        console.error('Error getting wedding details:', error);
        res.status(500).send('Error getting wedding details');
    }
});

// GET /api/wedding-details: Get all wedding details
router.get('/', async (req, res) => {
    const snapshot = await weddingDetailsCollection.get();
    const weddingDetails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(weddingDetails);
});

// GET /api/wedding-details/:id: Get a specific wedding detail by ID
router.get('/:id', async (req, res) => {
    const doc = await weddingDetailsCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send('Detail not found');
    res.json({ id: doc.id, ...doc.data() });
});

// POST /api/wedding-details: Add a new wedding detail
router.post('/', async (req, res) => {
    const newDetail = {
        date: req.body.date,
        text: req.body.text
    };
    const docRef = await weddingDetailsCollection.add(newDetail);
    res.status(201).json({ id: docRef.id, ...newDetail });
});

// PUT /api/wedding-details/:id: Update an existing wedding detail by ID
router.put('/:id', async (req, res) => {
    const docRef = weddingDetailsCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Detail not found');

    await docRef.update({
        date: req.body.date,
        text: req.body.text
    });
    res.json({ id: doc.id, date: req.body.date, text: req.body.text });
});

// DELETE /api/wedding-details/:id: Delete a wedding detail by ID
router.delete('/:id', async (req, res) => {
    const docRef = weddingDetailsCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Detail not found');

    await docRef.delete();
    res.json({ id: doc.id });
});

module.exports = router;
