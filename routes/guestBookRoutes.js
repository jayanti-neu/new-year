const express = require('express');
const router = express.Router();
const db = require('../firebase').db;

const guestBookCollection = db.collection('guestBookEntries');

// GET /api/guestbook: Get all guest book entries
router.get('/', async (req, res) => {
    const snapshot = await guestBookCollection.get();
    const guestBookEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(guestBookEntries);
});

// GET /api/guestbook/:id: Get a specific guest book entry by ID
router.get('/:id', async (req, res) => {
    const doc = await guestBookCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send('Entry not found');
    res.json({ id: doc.id, ...doc.data() });
});

// POST /api/guestbook: Add a new guest book entry
router.post('/', async (req, res) => {
    console.log(req.body);
    const newEntry = {
        name: req.body.name,
        message: req.body.message
    };
    const docRef = await guestBookCollection.add(newEntry);
    res.redirect('/guestbook');
});

// PUT /api/guestbook/:id: Update an existing guest book entry by ID
router.put('/:id', async (req, res) => {
    const docRef = guestBookCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Entry not found');

    await docRef.update({
        name: req.body.name,
        message: req.body.message
    });
    res.json({ id: doc.id, name: req.body.name, message: req.body.message });
});

// DELETE /api/guestbook/:id: Delete a guest book entry by ID
router.delete('/:id', async (req, res) => {
    const docRef = guestBookCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Entry not found');

    await docRef.delete();
    res.json({ id: doc.id });
});

module.exports = router;