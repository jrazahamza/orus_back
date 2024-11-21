const express = require('express');
const authRoutes = require('./Routes/Users');
const mongoose = require('mongoose')
const Amadeus = require('amadeus');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({ origin: 'https://orus-back-3bgg.vercel.app/' }));

//app.use(cors({ origin: 'http://localhost:3000' }));
// API Routes
app.use('/api/auth', authRoutes);
app.get("/", (req, res) => res.send("Express on Vercel"));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => {
    console.log('MongoDB connected');
     
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));

  // RUK MongoDB connection
  // mongoose.connect(process.env.MONGO_URI)
  //     .then(() => console.log('Connected to MongoDB'))
  //     .catch((error) => console.error('Connection error:', error));
  
 
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});


app.get('/api/flight-search', async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: 1, 
      currencyCode: 'USD', 
    });

    res.json(response.data);
  } catch (error) {
    console.error('Amadeus API Error:', error.response.body);
    res.status(500).json({ error: 'Failed to fetch flight offers' });
  }
});
