const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const Config = require('./DB/Config');
const festivalRoutes = require('./Router/Festival');
const UserRoutes = require('./Router/User');
const BookingRoutes = require('./Router/Booking');
  
const App = express();

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files as static files
App.use('/uploads', express.static(path.join(__dirname, 'uploads')));

App.use('/api/bookings', BookingRoutes);
App.use('/api/festivals', festivalRoutes);
App.use('/api/v1', UserRoutes);

App.listen(process.env.PORT || 3000, (req,res) => {
  console.log('Server is running on port 3000');
});