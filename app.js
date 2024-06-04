require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require("./routes/auth");
const protectedRoute = require("./routes/protectedRoute");
const cors = require('cors');

const dbURI = process.env.DB_URI;
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: function(origin, callback){
    const whitelist = ['http://localhost:4200', 'https://maquettes.geek-tonic.dev'];
    if(whitelist.indexOf(origin) !== -1){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/auth", authRoutes);
app.use("/protected", protectedRoute);

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
