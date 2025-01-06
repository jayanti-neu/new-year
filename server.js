const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
const serviceAccount = require('./serviceAccountKey.json');
const engine = require('ejs-mate');
const app = express();
const port = process.env.PORT || 3000;

// Use ejs-mate for all ejs templates
app.engine('ejs', engine);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const rsvpRoutes = require('./routes/rsvpRoutes');
const photoGalleryRoutes = require('./routes/photoGalleryRoutes');
const giftRegistryRoutes = require('./routes/giftRegistryRoutes');
const guestBookRoutes = require('./routes/guestBookRoutes');
const weddingDetailsRoutes = require('./routes/weddingDetailsRoutes');
const pageRoutes = require('./routes/pageRoutes');

// Use routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/photos', photoGalleryRoutes);
app.use('/api/gifts', giftRegistryRoutes);
app.use('/api/guestbook', guestBookRoutes);
app.use('/api/details', weddingDetailsRoutes);
app.use('/', pageRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});