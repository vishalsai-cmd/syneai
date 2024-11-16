const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    tags: {
/*       car_type: String,
      company: String,
      dealer: String, */

      car_type: { type: String, default: '' },
      company: { type: String, default: '' },
      dealer: { type: String, default: '' },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  }, { timestamps: true });
  
  const Car = mongoose.model('Car', carSchema);
  module.exports=Car