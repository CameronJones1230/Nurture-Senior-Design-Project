const mongoose = require('mongoose');
const { Schema } = mongoose;

const SensorSettingsSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sensorType: { 
    type: String, 
    required: true,
    enum: ['moisture', 'temperature', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'par', 'ec'] 
  },
  min: { 
    type: Number, 
    default: null 
  },
  max: { 
    type: Number, 
    default: null 
  },
  hold: { 
    type: Number, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

SensorSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const SensorSettings = mongoose.model('SensorSettings', SensorSettingsSchema);

module.exports = SensorSettings;
