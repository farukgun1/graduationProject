const mongoose = require('mongoose');


const OtherDetailSchema = new mongoose.Schema({
  facade: {
    type: [String],
    enum: [
      'West', 'East', 'North', 'South'
    ],
    required: false
  },
  general: {
    type: [String],
    enum: [
      'Subdivided', 'Parcelled', 'Project', 'CornerParcel'
    ],
    required: false
  },
  environment: {
    type: [String],
    enum: [
      'ShoppingCenter', 'Municipality', 'Mosque', 'Cemetery',
      'Seafront', 'Pharmacy', 'EntertainmentCenter', 'Fair',
      'Hospital', 'Church', 'Market', 'Park', 'PoliceStation',
      'HealthCenter', 'NeighborhoodMarket', 'Gym', 'University',
      'Primary/SecondarySchool', 'CityCenter'
    ],
    required: false
  },
  disabledFriendly: {
    type: [String],
    enum: [
      'ParkingSpace',
      'Elevator',
      'Bathroom',
      'WideCorridor',
      'Entrance/Ramp',
      'Stairs',
      'Kitchen',
      'RoomDoor',
      'ParkingSocket/ElectricSwitch',
      'HandrailRailing',
      'Toilet',
      'SwimmingPool'
    ],
    required: false
  },
  external: {
    type: [String],
    enum: [
      'Elevator',
      'Balcony',
      'Garden',
      'Penthouse',
      'SeaBus',
      'CoveredGarage',
      'Nursery',
      'PrivatePool',
      'ParkingLot',
      'SwimmingPool',
      'SteamRoom',
      'Security',
      'TurkishBath',
      'Hydrophore',
      'ThermalInsulation',
      'Generator',
      'CableTV',
      'DaycareCenter',
      'Playground',
      'Sauna',
      'SoundInsulation',
      'Siding',
      'SportsArea',
      'WaterTank',
      'TennisCourt',
      'Satellite',
      'FireEscape',
      'SwimmingPool(Outdoor)'
    ],
    required: false
  },
  internal: {
    type: [String],
    enum: [
      'ADSL', 'WoodenJoinery', 'SmartHome', 'BurglarAlarm', 'FireAlarm',
      'SquatToilet', 'AluminumJoinery', 'AmericanKitchen', 'Built-inOven',
      'Elevator', 'Balcony', 'Barbecue', 'WhiteGoods', 'Painted',
      'Dishwasher', 'Refrigerator', 'Wallpaper', 'ShowerCabin', 'MasterBathroom',
      'FiberInternet', 'Oven', 'DressingRoom', 'Built-inWardrobe',
      'VideoIntercom', 'HiltonBathroom', 'IntercomSystem', 'DoubleGlazing',
      'CentralHeating', 'Carpet', 'LaundryRoom', 'Built-inKitchen',
      'Sauna', 'FloorHeating', 'CentralVacuum' // Yeni değer eklendi
    ],
    required: false
  },
  transportation: {
    type: [String],
    enum: [
      "MainRoad",
      "EurasiaTunnel",
      "BosphorusBridges",
      "Street",
      "SeaBus",
      "Minibus",
      "E5",
      "Airport",
      "Marmaray",
      "Metro",
      "Metrobus",
      "BusStop",
      "CableCar",
      "Tram",
      "Siding",
      "TrainStation",
      "Pier"
    ],
    required: false
  },
  view: {
    type: [String],
    enum: [
      'Bosphorus', 'Sea', 'Lake', 'City', 'Nature', 'Mountain', 'Park'
    ],
    required: false
  },
  residentialType: {
    type: [String],
    enum: [
      'IntermediateFloor', 'IntermediateFloorDuplex', 'GardenDuplex', 'Penthouse',
      'Duplex', 'FloorDuplex', 'Detached', 'Triplex', 'GroundFloor', 'Studio'
    ],
    required: false
  },
  infrastructure: {
    type: [String],
    enum: [
      "Electricity",
      "IndustrialElectricity",
      "Water",
      "Telephone",
      "NaturalGas",
      "Sewage",
      "WaterTreatment",
      "WellAndBorehole",
      "SoilStudy",
      "RoadCleared",
      "RoadNotCleared",
      "NoRoad"
    ],
    required: false
  },
  location: {
    type: [String],
    enum: [
      "CloseToMainRoad",
      "Seafront",
      "CloseToSea",
      "CloseToAirport",
      "CloseToPublicTransport",
      "NearSea"
    ],
    required: false
  }



});


const portfolio = new mongoose.Schema({
  
    portfoliotype: {
        type: String,
        enum: ['Site', 'Ticari', 'Endüstriyel', 'Müstakil', 'Arsa', 'Bina', 'Mix'],
        required: false
    },
    personelId:{
      type:String,
      required:false
    },
    propertyOwnerId: {
      type:String,
      required:false
    },
    portfolioName:{
      type:String,
      required:false
    }
    ,
    duesM2Price:{
        type:String,
        required:false
    },
    rentM2Price:{
        type:String,
        required:false
    },
    country: { 
        type: String,
        required: false
      },
      province: { 
        type: String,
        required: false
      },
      district: { 
        type: String,
        required: false
      },
      neighborhood: { 
        type: String,
        required: false
      },
    
      latitude: { 
        type: String,
        required: false
      },
      longitude: { 
        type: String,
        required: false
      },


      photos:{ 
        type: String, 
        required: false
      },
    
      otherDetails:[OtherDetailSchema],

    
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



const portfolioSchema = mongoose.model('portfolios', portfolio)

module.exports = { portfolioSchema }

