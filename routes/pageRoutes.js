const express = require('express');
const router = express.Router();
const db = require('../firebase').db;
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.render('index', { title: 'Home', bgClass: 'default' });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Page', bgClass: 'admin' });
});

router.get('/guestbook', (req, res) => {
    db.collection('guestBookEntries').get()
        .then(snapshot => {
            const guestBookEntries = snapshot.docs.map(doc => doc.data());
            console.log(guestBookEntries);
            res.render('guestbook', { title: "Guest Book", guestBookEntries, bgClass: 'about' });
        })
        .catch(error => {
            console.error('Error retrieving guestbook entries:', error);
            res.status(500).send('Error retrieving guestbook entries');
        });
});

router.get('/registry', (req, res) => {
    res.render('registry', { title: 'Registry', bgClass: '' });
});

router.get('/rsvp', (req, res) => {
    res.render('rsvp', { title: 'RSVP', bgClass: 'about' });
});

router.get('/photos', (req, res) => {
    const imgDir = path.join(__dirname, '../public/img');
    const images = fs.readdirSync(imgDir);
    res.render('photos', { title: "Photo Gallery", images: images, bgClass: 'default' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About', bgClass: '' });
});

module.exports = router;
