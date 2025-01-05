const express = require('express');
const router = express.Router();
const db = require('../server').db; // Adjust the path as needed

// Get all RSVPs
router.get('/', async (req, res) => {
    const snapshot = await db.collection('rsvps').get();
    const rsvps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rsvps);
});

// Get a specific RSVP by ID
router.get('/:id', async (req, res) => {
    const doc = await db.collection('rsvps').doc(req.params.id).get();
    if (!doc.exists) {
        return res.status(404).send('RSVP not found');
    }
    res.json({ id: doc.id, ...doc.data() });
});

// Create a new RSVP
router.post('/', async (req, res) => {
    const newRSVP = req.body;
    const docRef = await db.collection('rsvps').add(newRSVP);
    res.status(201).json({ id: docRef.id, ...newRSVP });
});

// Update an existing RSVP by ID
router.put('/:id', async (req, res) => {
    const updatedRSVP = req.body;
    await db.collection('rsvps').doc(req.params.id).set(updatedRSVP, { merge: true });
    res.json({ id: req.params.id, ...updatedRSVP });
});

// Delete an RSVP by ID
router.delete('/:id', async (req, res) => {
    await db.collection('rsvps').doc(req.params.id).delete();
    res.status(204).send();
});

module.exports = router;