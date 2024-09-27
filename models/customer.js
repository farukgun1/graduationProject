const mongoose = require('mongoose')
const customer = new mongoose.Schema({
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
  birthDate: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  personelId:{
    type:String,
    required:true,
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
})

const customerSchema = mongoose.model('customers', customer)

module.exports = { customerSchema }
