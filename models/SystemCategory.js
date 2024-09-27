const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false
    },
});

const systemCategory = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    subcategory: [subcategorySchema],
    userId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        required: true
    },
    actions: {
        type: Array,
        default: []
    },
})


const systemCategorySchema = mongoose.model('systemCategory', systemCategory)

module.exports = { systemCategorySchema }

