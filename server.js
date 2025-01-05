const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
const serviceAccount = require('./etc/secrets/serviceAccountKey.json');
const engine = require('ejs-mate');
const app = express();
const port = process.env.PORT || 3000;


// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wedding-registry-13395.firebaseio.com'
});

const db = admin.firestore();

// Use ejs-mate for all ejs templates
app.engine('ejs', engine);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


const rsvpRoutes = require('./routes/rsvpRoutes');
const photoGalleryRoutes = require('./routes/photoGalleryRoutes');
const giftRegistryRoutes = require('./routes/giftRegistryRoutes');
const guestBookRoutes = require('./routes/guestBookRoutes');

app.use('/api/rsvp', rsvpRoutes);
app.use('/api/photos', photoGalleryRoutes);
app.use('/api/gifts', giftRegistryRoutes);
app.use('/api/guestbook', guestBookRoutes);

const guestBookCollection = db.collection('guestBookEntries');
const weddingDetailsCollection = db.collection('weddingDetailsCollection');


// GET /api/details: Get the wedding details object
// app.get('/api/details', async (req, res) => {
//     try {
//         const doc = await weddingDetailsCollection.doc('details').get();
//         if (!doc.exists) return res.status(404).send('Details not found');
//         const data = doc.data();
//         data.date = data.date.toDate();
//         res.json(doc.data());
//     } catch (error) {
//         console.error('Error getting wedding details:', error);
//         res.status(500).send('Error getting wedding details');
//     }
// });

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', bgClass: 'default' });
});

app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Page', bgClass: 'admin' });
});

app.get('/guestbook', (req, res) => {
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

// GET /api/guestbook: Get all guest book entries
app.get('/api/guestbook', async (req, res) => {
    const snapshot = await guestBookCollection.get();
    const guestBookEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(guestBookEntries);
});

// GET /api/guestbook/:id: Get a specific guest book entry by ID
app.get('/api/guestbook/:id', async (req, res) => {
    const doc = await guestBookCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send('Entry not found');
    res.json({ id: doc.id, ...doc.data() });
});

// POST /api/guestbook: Add a new guest book entry
app.post('/api/guestbook', async (req, res) => {
    console.log(req.body);
    const newEntry = {
        name: req.body.name,
        message: req.body.message
    };
    const docRef = await guestBookCollection.add(newEntry);
    // res.status(201).json({ id: docRef.id, ...newEntry });
    res.redirect('/guestbook');
});

// PUT /api/guestbook/:id: Update an existing guest book entry by ID
app.put('/api/guestbook/:id', async (req, res) => {
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
app.delete('/api/guestbook/:id', async (req, res) => {
    const docRef = guestBookCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Entry not found');

    await docRef.delete();
    res.json({ id: doc.id });
});

// GET /api/wedding-details: Get all wedding details
app.get('/api/wedding-details', async (req, res) => {
    const snapshot = await weddingDetailsCollection.get();
    const weddingDetails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(weddingDetails);
});

// GET /api/wedding-details/:id: Get a specific wedding detail by ID
app.get('/api/wedding-details/:id', async (req, res) => {
    const doc = await weddingDetailsCollection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).send('Detail not found');
    res.json({ id: doc.id, ...doc.data() });
});

// POST /api/wedding-details: Add a new wedding detail
app.post('/api/wedding-details', async (req, res) => {
    const newDetail = {
        date: req.body.date,
        text: req.body.text
    };
    const docRef = await weddingDetailsCollection.add(newDetail);
    res.status(201).json({ id: docRef.id, ...newDetail });
});

// PUT /api/wedding-details/:id: Update an existing wedding detail by ID
app.put('/api/wedding-details/:id', async (req, res) => {
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
app.delete('/api/wedding-details/:id', async (req, res) => {
    const docRef = weddingDetailsCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send('Detail not found');

    await docRef.delete();
    res.json({ id: doc.id });
});
app.get('/registry', (req, res) => {
    res.render('registry', { title: 'Registry', bgClass: '' });
});

app.get('/rsvp', (req, res) => {
    res.render('rsvp', { title: 'RSVP', bgClass: '' });
});
app.get('/photos', (req, res) => {
    res.render('photos', { title: 'Photos', bgClass: '' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', bgClass: 'about' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});