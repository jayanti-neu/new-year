const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./credentials/serviceAccountKey.json');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wedding-registry-13395.firebaseio.com'
});

const db = admin.firestore();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rsvpRoutes = require('./routes/rsvpRoutes');
const photoGalleryRoutes = require('./routes/photoGalleryRoutes');
const giftRegistryRoutes = require('./routes/giftRegistryRoutes');
const guestBookRoutes = require('./routes/guestBookRoutes');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/registry', (req, res) => {
    res.render('registry');
});
app.get('/guestbook', (req, res) => {
    db.collection('guestbook').get()
        .then(snapshot => {
            const guestBookEntries = snapshot.docs.map(doc => doc.data());
            res.render('guestbook', { guestBookEntries });
        })
        .catch(error => {
            console.error('Error retrieving guestbook entries:', error);
            res.status(500).send('Error retrieving guestbook entries');
        });
}); 
app.get('/rsvp', (req, res) => {
    res.render('rsvp');
});
app.get('/photos', (req, res) => {
    res.render('photos');
});

app.use('/api/rsvp', rsvpRoutes);
app.use('/api/photos', photoGalleryRoutes);
app.use('/api/gifts', giftRegistryRoutes);
app.use('/api/guestbook', guestBookRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});