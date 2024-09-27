const mongoose = require('mongoose');

const personel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    createdAt: {
        type: Number,
        required: false
    },
    updatedAt: {
        type: Number,
        required: false
    },
    actions: {
        type: Array,
        default: []
    },
});



const personelSchema = mongoose.model('personels', personel)

module.exports = { personelSchema }

