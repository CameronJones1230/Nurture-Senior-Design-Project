const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Sensor Data Schema
const SensorDataSchema = new Schema({
  timestamp: { type: Date, default: Date.now }, // Defaults to the current date/time
  moisture: { type: Number, default: -1 }, // Default value -1
  ph: { type: Number, default: -1 },
  nitrogen: { type: Number, default: -1 },
  phosphorus: { type: Number, default: -1 },
  potassium: { type: Number, default: -1 },
  temperature: { type: Number, default: -1 },
  par: { type: Number, default: -1 },
  ec: { type: Number, default: -1 }
});

// Define the Plant Schema
const PlantSchema = new Schema({
  name: { 
    type: String, 
    required: false, 
    default: 'Unnamed Plant' // Fallback name if none provided 
  },
  species: { 
    type: String, 
    required: false, 
    default: 'Unknown Species' 
  },
  image: { 
    type: String, 
    default: 'defaultplant' 
  },
  sensorData: [SensorDataSchema] // Embed multiple sensor data entries
});

// Define the User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate usernames
  },
  password: {
    type: String,
    required: true
  },
  plants: {
    type: [PlantSchema], // Array of plants
    default: [] // Defaults to an empty array if no plants are provided
  }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
