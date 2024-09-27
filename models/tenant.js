const mongoose = require('mongoose')
const tenant = new mongoose.Schema({

  personelId: {
    type: String,
    required: false
},
    name: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },
      taxId: { 
        type: String,
        required: true,
      },
      secondPersonFirstName: {
        type: String,
        required: false,
      },
      secondPersonLastName: { 
        type: String,
        required: false,
      },
      secondPersonPhone: { 
        type: String,
        required: false,
      },
      rating: { 
        type: Number,
        required: false,
      },
    
    
      isActive: {
        type: Boolean,
        required: false,
        default:true
      },
      createdAt: {
        type: Number,
        required: false,
      },
      updatedAt: {
        type: Number,
        required: false,
      },
      actions: {
        type: Array,
        default: [],
      },
    });
    const tenantSchema = mongoose.model('tenants', tenant)

module.exports = { tenantSchema }
