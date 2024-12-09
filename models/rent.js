const { privateDecrypt } = require('crypto');
const mongoose = require('mongoose')

const rent = new mongoose.Schema({


  propertyId: {
      type: String,
      required: true  
  },
  portfolioId: {
      type: String,
      required: true
  },
  personelId: {
    type: String,
    required: false
},
  tenantId: {
      type: String,
      required: false
  },
  contractType: {
      type: String,
      required: false
  },
  currentCode: {
      type: String,
      required: false
  },
  contractStartDate: {
      type: String,
      required: false
  },
  contractEndDate: {
      type: String,
      required: false
  },
  startingRentAmount: {
      type: String,
      required: false
  },
  rentalfee: {
      type: String,
      required: false
  },
  paymentDay: {
      type: String,
      required: false
  },
  rentType: {
      type: String,
      required: false
  },
  rentIncreaseType: {
      type: String,
      required: false
  },
  depositAmount: {
      type: String,
      required: false
  },
  maintenanceFee: {
      type: String,
      required: false
  },
  maintenanceStartDate: {
      type: String,
      required: false
  },
  maintenanceFeeAmount: {
      type: String,
      required: false
  },
  propertyName: {
    type: String,
    required: false
},
tenantName: {
    type: String,
    required: false
},
tenanttype: {
  type: String,
  required: false
},

tenantName: {
  type: String,
  required: false
},

tenantName: {
  type: String,
  enum: ["isyeri", "sahis"],
  required: false
},



noticeoftermination: {
  type: String,
  required: false
},
evacuationcommitment: {
  type: String,
  enum: ["var", "yok"],
  required: false
},







  payments: [
    {
      paymentDate: {
        type: String,  
        required: true
      },
      rentAmount: {
        type: String, 
        required: true
      },
      isPaid: {
        type: Boolean, 
        default: false
      },
      paidDate: {
        type: String,  
        required: false
      },
      receipt: {
        type: String,  
        required: false
      }
    }
  ],
  


    
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
});

const RentSchema = mongoose.model('Rents', rent)

module.exports = { RentSchema }