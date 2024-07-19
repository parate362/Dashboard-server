const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const fs = require('fs');
const path = require('path')
const cors = require('cors');
const exp = require('constants');
const router =express.Router();
require('dotenv').config();
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
  });

// Middleware
app.use(express.json()); // Parse JSON requests
const allowedOrigins = ["http://localhost:3000","https://dashboard-client-plum.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

fs.readdirSync(path.join(__dirname,'/src/routes/')).forEach(function(fileName) {
  if(fileName === 'index.js' || fileName.substr(fileName.lastIndexOf('.')) !== 'js'){
      const name = fileName.substr(0,fileName.indexOf('.'))
      require('./src/routes/' + name)(app,router)
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({ message: 'Internal Server Error' }); // Respond with a 500 status code
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
