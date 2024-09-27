const mongoose = require('mongoose')

const expense=new mongoose.Schema({
    propertyId: {
        type: String,
        required: true  
      },
      expenseName: {
        type: String,
        required: true  
      },
      expenseAmount: {
        type: String,
        required: true  
      },
      expenseDescription: {
        type: String,
        required: true  
      },
      expensePaymentDate: {
        type: String,
        required: true  
      },
      expenseStatus: {
        type: String,
        required: true,
        enum:['odendi','odenmedi']
      },
      isActive: {
        type: Boolean,
        required: false,
        default:true,
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
const ExpenseSchema = mongoose.model('Expenses', expense)

module.exports = { ExpenseSchema }